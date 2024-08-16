export default interface StreamTrack {
    audioData: Buffer;
    beats: TrackBeat[];
}
export interface TrackBeat {
    timingValue: number;
    controlValue: number;
}
