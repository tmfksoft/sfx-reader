interface Slot {
    bufferOffset: number;
    bufferSize: number;
    unknown: number[];
    ignored: number[];
}
export default interface AudioBankSlot {
    numSlots: number;
    slots: Slot[];
}
export {};
