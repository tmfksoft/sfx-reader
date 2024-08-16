import AudioBankLookup from "./interfaces/AudioBankLookup";
import * as path from 'path';
import * as fs from 'fs';
import PointerBuffer from "@majesticfudgie/pointer-buffer";
import AudioStream from "./interfaces/AudioStream";
import StreamTrack, { TrackBeat } from "./interfaces/sfx/StreamTrack";
import { error } from "console";
import SoundMeta from "./interfaces/sfx/SoundMeta";
import SoundEffect from "./interfaces/SoundEffect";

/**
 * Useful documentation can be found here.
 * https://gtamods.com/wiki/SFX_(SA)
 * https://gtamods.com/wiki/Audio_stream
 */

/**
 * A GTA:SA SFX Reader
 * 
 * Parses the following files:
 * BankLKup.dat - Audio Bank Lookup
 * BankSlot.dat - Audio Bank Slot List
 * PakFiles.dat - List of audio package files from ~/audio/sfx dir
 */
class SFXReader {

	public packageEntries: string[] = [];
	public bankLookups: AudioBankLookup[] = [];

	/**
	 * All standard audio stream file names.
	 * Used to sanity check supplied names
	 */
	public streamNames = [
		"AA",
		"ADVERTS",
		"AMBIENCE",
		"BEATS",
		"CH",
		"CO",
		"CR",
		"CUTSCENE",
		"DS",
		"HC",
		"MH",
		"MR",
		"NJ",
		"RE",
		"RG",
		"TK"
	];

	constructor(protected gtaDir: string) {

	}

	loadPackageEntries(): string[] {
		const pakFile = path.join(this.gtaDir, "audio", "CONFIG", "PakFiles.dat");
		if (!fs.existsSync(pakFile)) {
			throw new Error("Unable to find PakFiles.dat!");
		}

		const pakData = fs.readFileSync(pakFile);
		const pakBuf = new PointerBuffer(pakData);

		const entryCount = pakBuf.size / 52;

		const entryNames: string[] = [];

		for (let i=0; i<entryCount; i++) {
			const entryName = pakBuf.readString(52).trim();
			entryNames.push(entryName);
		}

		this.packageEntries = entryNames;

		return entryNames;
	}

	loadAudioBankLookups(): AudioBankLookup[] {
		const bankFile = path.join(this.gtaDir, "audio", "CONFIG", "BankLkup.dat");

		if (!fs.existsSync(bankFile)) {
			throw new Error("Unable to find BankLkup.dat!");
		}

		const bankData = fs.readFileSync(bankFile);
		const bankBuf = new PointerBuffer(bankData);

		const metaCount = bankBuf.size / 12;
		const lookups: AudioBankLookup[] = [];

		for (let i=0; i<metaCount; i++) {
			const packageIndex = bankBuf.readUint8();
			
			// Skip padding...
			bankBuf.forward(3); // Skip 3 bytes

			const bankHeaderOffset = bankBuf.readUint32();
			const bankSize = bankBuf.readUint32();

			lookups.push({
				packageIndex,
				bankHeaderOffset,
				bankSize,
			});
		}

		this.bankLookups = lookups;

		return lookups;
	}

	/**
	 * Returns a byte from the encoding key wrapping the index if needed.
	 * @param index Index of the encoding key
	 * @returns 
	 */
	getKeyByte(index: number) {
		const encodingKey = [ 0xEA, 0x3A, 0xC4, 0xA1, 0x9A, 0xA8, 0x14, 0xF3, 0x48, 0xB0, 0xD7, 0x23, 0x9D, 0xE8, 0xFF, 0xF1 ];
		const finalIndex = Math.abs(index % encodingKey.length);
		return encodingKey[finalIndex];
	}

	decodeStream(input: Buffer): Buffer {
		const decodedStream = Buffer.alloc(input.length);
		for (let i=0; i<input.length; i++) {
			decodedStream[i] = input[i] ^ this.getKeyByte(i);
		}
		return decodedStream;
	}

	/**
	 * Reads and parses and audio stream file from disk,
	 * returning contained tracks with any associated beat information.
	 * 
	 * It's advised you try not to keep this data in memory any longer than you need to.
	 * Purely for the sake of memory usage.
	 * 
	 * @param streamName File to open e.g. AMBIENCE
	 * @returns AudioStream with associated tracks
	 */
	getAudioStream(streamName: string): AudioStream {
		if (!this.streamNames.includes(streamName.toUpperCase())) {
			throw new Error("Invalid Stream Name");
		}

		const streamPath = path.join(this.gtaDir, "audio", "streams", streamName);
		if (!fs.existsSync(streamPath)) {
			throw new Error("Couldn't find stream! " + streamPath)
		}
		const parsedStream: AudioStream = {
			tracks: [],
		};

		const streamData = fs.readFileSync(streamPath);
		const decodedStream = this.decodeStream(streamData);
		const streamBuf = new PointerBuffer(decodedStream);

		let trackNum = 0;

		while (streamBuf.hasMore) {
			const trackBeats: TrackBeat[] = [];

			const beatEntry = streamBuf.readSection(8000);
			const lengthEntry = streamBuf.readSection(64);
			const magicString = streamBuf.readSection(4);

			// Parse the beat entry
			const beatBuf = new PointerBuffer(beatEntry);

			// 1000 Beats
			for (let i=0; i<1000; i++) {
				const timingValue = beatBuf.readDWORD();
				const controlValue = beatBuf.readDWORD();
				if (timingValue === -1) {
					continue;
				}
				trackBeats.push({
					timingValue,
					controlValue
				})
			}

			// Parse the length entry
			const lengthBuf = new PointerBuffer(lengthEntry);

			let oggLength = 0;

			// There's 8 length pairs.
			for (let i=0; i<8; i++) {
				const oggSize = lengthBuf.readDWORD(); // Length in bytes
				const sampleRate = lengthBuf.readDWORD(); // Not used

				// Look for the oggSize above zero.
				if (oggSize > 0) {
					oggLength = oggSize;
				}
			}

			const oggTrack = streamBuf.readSection(oggLength);
			parsedStream.tracks.push({
				beats: trackBeats,
				audioData: oggTrack,
			});
			trackNum++;
		}
		
		return parsedStream;
	}

	/**
	 * Retrieves a specific track from the audio stream file supplied.
	 * You could call getAudioStream and fetch the track or use this method
	 * as a convenience method, it handles sanity checking the track id.
	 * 
	 * Track ID's start at 1, just to conform to how everyone refers to the tracks.
	 * 
	 * It's advised you try not to keep this data in memory any longer than you need to.
	 * Purely for the sake of memory usage.
	 * 
	 * @param streamName Audio stream file e.g. AMBIENCE
	 * @param trackId Track ID (1 is first)
	 * @returns Parsed StreamTrack with audio data and beats
	 */
	getStreamTrack(streamName: string, trackId: number): StreamTrack {
		const stream = this.getAudioStream(streamName);

		if (trackId < 1) {
			throw new Error("Invalid Track ID");
		}
		if (trackId > stream.tracks.length) {
			throw new Error("Invalid Track ID");
		}
		
		// Needs some sanity checks.
		return stream.tracks[trackId-1];
	}

	/**
	 * Retrieves a specific sound effect.
	 * Using the supplied package name, bank index and slot index a Buffer
	 * containing PCM data is returned.
	 * 
	 * Indexes start at 1 rather than 0 to line up with documentation
	 * and how the community refers to them.
	 * 
	 * @param packageName One of FEET, GENRL, PAIN_A, SCRIPT, SPC_EA, SPC_FA, SPC_GA, SPC_NA, SPC_PA
	 * @param bankIndex Bank Index - Starts at 1
	 * @param slotIndex Slot Index - Starts at 1
	 */
	getSoundEffect(packageName: string, bankIndex: number, slotIndex: number) {
		// Check for a valid package name
		if (!this.packageEntries.includes(packageName.toUpperCase())) {
			throw new Error("Invalid package name!");
		}

		// Unsure how the game uses bank lookups in reality.
		const lookup = this.getLookup(packageName, bankIndex);

		if (!lookup) {
			throw new Error("Invalid bank index!");
		}

		const packagePath = path.join(this.gtaDir, "audio", "sfx", packageName.toUpperCase());
		const packageData = fs.readFileSync(packagePath);

		const bankSize = 4804;

		const header = packageData.subarray(lookup.bankHeaderOffset, lookup.bankHeaderOffset + bankSize);

		// ... apparently.
		const headerBuf = new PointerBuffer(header);
		const soundCount = headerBuf.readUint16();

		if (soundCount > 400) {
			throw new Error("Sound package cannot contain more than 400 sounds!");
		}

		const padding = headerBuf.readUint16(); // Assuming this is always 0?
		
		const sounds: SoundMeta[] = [];
		for (let i=0; i<soundCount; i++) {
				
			const bufferOffset = headerBuf.readUint32();
			const loopOffset = headerBuf.readDWORD(); // Signed 32
			const sampleRate = headerBuf.readUint16();
			const headroom = headerBuf.readUint16();

			sounds.push({
				bufferOffset,
				loopOffset,
				sampleRate,
				headroom
			});
		}

		// Sanity check the sound index.
		if (slotIndex < 1 || slotIndex > sounds.length) {
			throw new Error("Invalid sound index!");
		}

		const selectedSound = sounds[slotIndex - 1];
		let soundSize = 0;
		if (slotIndex === sounds.length) {
			soundSize = lookup.bankSize - selectedSound.bufferOffset;
		} else {
			const nextSound = sounds[slotIndex];
			soundSize = nextSound.bufferOffset - selectedSound.bufferOffset;
		}

		const soundStartOffset = (lookup.bankHeaderOffset + bankSize) + selectedSound.bufferOffset;
		const soundData = packageData.subarray(soundStartOffset, soundStartOffset + soundSize);
		

		return {
			sampleRate: selectedSound.sampleRate,
			headRoom: selectedSound.headroom,
			loopOffset: selectedSound.loopOffset,
			soundData,
		} as SoundEffect;
	}

	/**
	 * Converts a sound effect to a wave file
	 * by appending the header.
	 */
	toWAV(effect: SoundEffect): Buffer {

		// Lets try and make a WAV file :D
		const wavBuf = Buffer.alloc(44 + effect.soundData.length);

		const bitRate = 16;
		const channels = 1;

		wavBuf.write("RIFF", 0); // RIFF File
		wavBuf.writeUInt32LE((44 + effect.soundData.length) - 8, 4); // Seems to randomly be altered by a number
		wavBuf.write("WAVE", 8); // File Format

		// "fmt" Chunk
		wavBuf.write("fmt ", 12); // Includes a space
		wavBuf.writeUint32LE(bitRate, 16); // Chunk size minus 8 bytes
		wavBuf.writeUint16LE(1, 20); // Type of format (2 bytes)
		wavBuf.writeUint16LE(1, 22); // Number of channels (2 bytes)
		wavBuf.writeUint32LE(effect.sampleRate, 24); // Sample Rate
		wavBuf.writeUint32LE((effect.sampleRate * bitRate * channels) / 8, 28); // Some other thing
		wavBuf.writeUInt16LE((bitRate * channels) / 8, 32); // Bits Per Sample * Channels / 8 --- "BlockAlign"
		wavBuf.writeUint16LE(bitRate, 34); // Bits Per Sample"

		// "data" Chunk
		wavBuf.write("data", 36);
		wavBuf.writeUint32LE(effect.soundData.length, 40);

		let paddingByte = 0;
		if (effect.soundData.length % 2 == 0) {
			paddingByte = 1;
		}

		for (let i=0; i<effect.soundData.length; i+=2) {
			const sampleByte = effect.soundData.readInt16LE(i);
			wavBuf.writeInt16LE(sampleByte, 43 + paddingByte + i);
		}

		return wavBuf;
	}

	/**
	 * Fetches the bank lookup for this package and bank
	 * @param packageName 
	 * @param bankIndex Bank Index - Starts at 1
	 */
	getLookup(packageName: string, bankIndex: number): AudioBankLookup | null {
		const realIndex = bankIndex - 1;
		
		const packageIndex = this.packageEntries.indexOf(packageName.toUpperCase());

		if (packageIndex < 0) {
			throw new Error("Invalid package index!");
		}

		const banks = this.bankLookups.filter((lk) => lk.packageIndex === packageIndex);

		return banks[realIndex];
	}

	// Loads and caches audio data into memory
	async load() {
		this.loadPackageEntries();
		this.loadAudioBankLookups();
	}


}
export default SFXReader;