/**
 * This represents and extracted sound effect from the game.
 */
export default interface SoundEffect {
    sampleRate: number;
    headRoom: number;
    loopOffset: number;
    soundData: Buffer;
}
