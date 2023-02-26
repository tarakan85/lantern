import { createSlice, createAction } from "@reduxjs/toolkit";

import { nextIndex } from "~/utils/array";

export type TModes = "regular" | "colorful";
export type TIntensity = "low" | "medium" | "high";
export type TColor =
  | "iridescent"
  | "redStatic"
  | "redFlicker"
  | "redBlueFlicker";

export type TLanternState = {
  isTurnedOn: boolean;
  modes: TModes[];
  modeIndex: number;
  submodes: {
    regular: TIntensity[];
    colorful: TColor[];
  };
  submodeIndexes: {
    regular: number;
    colorful: number;
  };
  showChargeIndicator: boolean;
  isCharging: boolean;
};

export const initialState: TLanternState = {
  isTurnedOn: false,
  modes: ["regular", "colorful"],
  modeIndex: 0,
  submodes: {
    regular: ["low", "medium", "high"],
    colorful: ["iridescent", "redStatic", "redFlicker", "redBlueFlicker"],
  },
  submodeIndexes: {
    regular: 0,
    colorful: 0,
  },
  showChargeIndicator: false,
  isCharging: false,
};

const slice = createSlice({
  name: "lantern",
  initialState,
  reducers: {
    togglePower(state) {
      state.isTurnedOn = !state.isTurnedOn;
    },

    switchSubmode(state) {
      const currentMode = state.modes[state.modeIndex];
      const currentSubmodeIndex = state.submodeIndexes[currentMode];
      const currentSubmodes = state.submodes[currentMode];

      state.submodeIndexes[currentMode] = nextIndex(
        currentSubmodeIndex,
        currentSubmodes
      );
    },

    switchMode(state) {
      state.modeIndex = nextIndex(state.modeIndex, state.modes);
    },
  },
});

export const reducer = slice.reducer;
export const name = slice.name;

const press = createAction(`${slice.name}/press`);
const release = createAction(`${slice.name}/release`);

export const actions = {
  ...slice.actions,
  press,
  release,
};
