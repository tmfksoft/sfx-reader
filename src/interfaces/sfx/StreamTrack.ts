export default interface StreamTrack {
	
	// Ogg Vorbis Audio Data
	audioData: Buffer,

	beats: TrackBeat[],
}

export interface TrackBeat {
	timingValue: number,
	controlValue: number,
}