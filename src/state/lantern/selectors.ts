import { createSelector } from "reselect";

import { capitalizeFirst } from "~/utils/string";

import { TContext } from "./lantern.machine";

export const selectMode = (state: TContext) => state.mode;
export const selectIntensity = (state: TContext) => state.intensity;
export const selectColor = (state: TContext) => state.color;

export const selectSubMode = createSelector(
  selectMode,
  selectIntensity,
  selectColor,
  (mode, intensity, color) =>
    ({
      regular: intensity,
      colorful: color,
    }[mode])
);

export const selectResultMode = createSelector(
  selectMode,
  selectSubMode,
  (mode, submode) => `${mode}${capitalizeFirst(submode)}` as const
);
