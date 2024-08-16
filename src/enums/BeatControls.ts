
// You can use this to check the beat control from an audio stream track.
// A lot of controls are duplicated for convenience and because they were there.
enum BeatControls {
	// Dancing
	DOWN_ARROW = 0x01,
	PS2_X = 0x01,
	XBOX_A = 0x01,

	LEFT_ARROW = 0x02,
	PS2_SQUARE = 0x02,
	XBOX_X = 0x02,

	UP_ARROW = 0x03,
	PS2_TRIANGLE = 0x03,
	XBOX_Y = 0x03,

	RIGHT_ARROW = 0x04,
	PS2_CIRCLE = 0x04,
	XBOX_B = 0x04,

	// Lowrider
	RIGHT_STICK_RIGHT = 0x09,
	NUM_6 = 0x09,

	RIGHT_STICK_LEFT = 0x0A,
	NUM_4 = 0x0A,

	RIGHT_STICK_UP_RIGHT = 0x0B,
	NUM_8_6 = 0x0B,

	RIGHT_STICK_DOWN_LEFT = 0x0C,
	NUM_2_4 = 0x0C,

	RIGHT_STICK_UP = 0x0D,
	NUM_8 = 0x0D,

	RIGHT_STICK_DOWN = 0x0E,
	NUM_2 = 0x0E,

	RIGHT_STICK_UP_LEFT = 0x0F,
	NUM_8_4 = 0x0F,

	RIGHT_STICK_DOWN_RIGHT = 0x10,
	NUM_2_6 = 0x10,

	END_OF_BEAT = 0x21,

}
export default BeatControls;