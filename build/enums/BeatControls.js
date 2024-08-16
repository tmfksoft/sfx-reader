"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// You can use this to check the beat control from an audio stream track.
// A lot of controls are duplicated for convenience and because they were there.
var BeatControls;
(function (BeatControls) {
    // Dancing
    BeatControls[BeatControls["DOWN_ARROW"] = 1] = "DOWN_ARROW";
    BeatControls[BeatControls["PS2_X"] = 1] = "PS2_X";
    BeatControls[BeatControls["XBOX_A"] = 1] = "XBOX_A";
    BeatControls[BeatControls["LEFT_ARROW"] = 2] = "LEFT_ARROW";
    BeatControls[BeatControls["PS2_SQUARE"] = 2] = "PS2_SQUARE";
    BeatControls[BeatControls["XBOX_X"] = 2] = "XBOX_X";
    BeatControls[BeatControls["UP_ARROW"] = 3] = "UP_ARROW";
    BeatControls[BeatControls["PS2_TRIANGLE"] = 3] = "PS2_TRIANGLE";
    BeatControls[BeatControls["XBOX_Y"] = 3] = "XBOX_Y";
    BeatControls[BeatControls["RIGHT_ARROW"] = 4] = "RIGHT_ARROW";
    BeatControls[BeatControls["PS2_CIRCLE"] = 4] = "PS2_CIRCLE";
    BeatControls[BeatControls["XBOX_B"] = 4] = "XBOX_B";
    // Lowrider
    BeatControls[BeatControls["RIGHT_STICK_RIGHT"] = 9] = "RIGHT_STICK_RIGHT";
    BeatControls[BeatControls["NUM_6"] = 9] = "NUM_6";
    BeatControls[BeatControls["RIGHT_STICK_LEFT"] = 10] = "RIGHT_STICK_LEFT";
    BeatControls[BeatControls["NUM_4"] = 10] = "NUM_4";
    BeatControls[BeatControls["RIGHT_STICK_UP_RIGHT"] = 11] = "RIGHT_STICK_UP_RIGHT";
    BeatControls[BeatControls["NUM_8_6"] = 11] = "NUM_8_6";
    BeatControls[BeatControls["RIGHT_STICK_DOWN_LEFT"] = 12] = "RIGHT_STICK_DOWN_LEFT";
    BeatControls[BeatControls["NUM_2_4"] = 12] = "NUM_2_4";
    BeatControls[BeatControls["RIGHT_STICK_UP"] = 13] = "RIGHT_STICK_UP";
    BeatControls[BeatControls["NUM_8"] = 13] = "NUM_8";
    BeatControls[BeatControls["RIGHT_STICK_DOWN"] = 14] = "RIGHT_STICK_DOWN";
    BeatControls[BeatControls["NUM_2"] = 14] = "NUM_2";
    BeatControls[BeatControls["RIGHT_STICK_UP_LEFT"] = 15] = "RIGHT_STICK_UP_LEFT";
    BeatControls[BeatControls["NUM_8_4"] = 15] = "NUM_8_4";
    BeatControls[BeatControls["RIGHT_STICK_DOWN_RIGHT"] = 16] = "RIGHT_STICK_DOWN_RIGHT";
    BeatControls[BeatControls["NUM_2_6"] = 16] = "NUM_2_6";
    BeatControls[BeatControls["END_OF_BEAT"] = 33] = "END_OF_BEAT";
})(BeatControls || (BeatControls = {}));
exports.default = BeatControls;
//# sourceMappingURL=BeatControls.js.map