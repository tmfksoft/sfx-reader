import AudioBankLookup from "./interfaces/AudioBankLookup";
import AudioStream from "./interfaces/AudioStream";
import StreamTrack from "./interfaces/sfx/StreamTrack";
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
declare class SFXReader {
    protected gtaDir: string;
    packageEntries: string[];
    bankLookups: AudioBankLookup[];
    /**
     * All standard audio stream file names.
     * Used to sanity check supplied names
     */
    streamNames: string[];
    constructor(gtaDir: string);
    loadPackageEntries(): string[];
    loadAudioBankLookups(): AudioBankLookup[];
    /**
     * Returns a byte from the encoding key wrapping the index if needed.
     * @param index Index of the encoding key
     * @returns
     */
    getKeyByte(index: number): number;
    decodeStream(input: Buffer): Buffer;
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
    getAudioStream(streamName: string): AudioStream;
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
    getStreamTrack(streamName: string, trackId: number): StreamTrack;
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
    getSoundEffect(packageName: string, bankIndex: number, slotIndex: number): SoundEffect;
    /**
     * Converts a sound effect to a wave file
     * by appending the header.
     */
    toWAV(effect: SoundEffect): Buffer;
    /**
     * Fetches the bank lookup for this package and bank
     * @param packageName
     * @param bankIndex Bank Index - Starts at 1
     */
    getLookup(packageName: string, bankIndex: number): AudioBankLookup | null;
    load(): Promise<void>;
}
export default SFXReader;
