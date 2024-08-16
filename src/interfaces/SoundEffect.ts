// See https://gtamods.com/wiki/SFX_(SA)#Sound_structure

/**
 * This represents and extracted sound effect from the game.
 */
export default interface SoundEffect {
	sampleRate: number, // In Hz
	headRoom: number, // How much louder than average this sound effect is expected to go.
	loopOffset: number, // Start of the loop in samples, -1 if it doesn't loop.
	soundData: Buffer, // Raw PCM bytes/samples
}