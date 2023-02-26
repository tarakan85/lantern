import { createSlice, createAction } from "@reduxjs/toolkit";

export type TModes = "regular" | "colorful";
export type TIntensity = "low" | "medium" | "high";
export type TColor =
  | "iridescent"
  | "redStatic"
  | "redFlicker"
  | "redBlueFlicker";

export type TState = {
  isTurnedOn: boolean;
  mode: TModes;
  intensity: TIntensity;
  color: TColor;
  showChargeIndicator: boolean;
  isCharging: boolean;
};

export const initialState: TState = {
  isTurnedOn: false,
  mode: "regular" as TModes,
  intensity: "low" as TIntensity,
  color: "redStatic" as TColor,
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
