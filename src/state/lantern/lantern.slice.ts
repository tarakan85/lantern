import { createSlice, createAction } from "@reduxjs/toolkit";

import * as types from "./lantern.types";
import { nextIndex } from "~/utils/array";

export const initialState: types.TState = {
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

    showChargingIndicator(state) {
      state.showChargeIndicator = true;
    },

    hideChargingIndicator(state) {
      if (!state.isCharging) {
        state.showChargeIndicator = false;
      }
    },

    putOnCharge(state) {
      state.isCharging = true;
      state.showChargeIndicator = true;
    },

    removeFromCharge(state) {
      state.isCharging = false;
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
