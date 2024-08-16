import SoundMeta from "./SoundMeta";
export default interface BankHeader {
    numSounds: number;
    padding: number;
    sounds: SoundMeta[];
}
