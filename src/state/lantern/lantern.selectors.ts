import { createSelector } from "reselect";

import { capitalize } from "~/utils/string";
import { TRootState } from "~/state/root/root.types";

const selectModes = (state: TRootState) => state.lantern.modes;
const selectModeIndex = (state: TRootState) => state.lantern.modeIndex;
const selectCurrentMode = createSelector(
  selectModes,
  selectModeIndex,
  (modes, index) => modes[index]
);

const selectSubmodes = (state: TRootState) => state.lantern.submodes;
const selectSubmodeIndexes = (state: TRootState) =>
  state.lantern.submodeIndexes;
const selectCurrentSubmode = createSelector(
  selectCurrentMode,
  selectSubmodes,
  selectSubmodeIndexes,
  (currentMode, submodes, submodeIndexes) =>
    submodes[currentMode][submodeIndexes[currentMode]]
);

export const selectResultMode = createSelector(
  selectCurrentMode,
  selectCurrentSubmode,
  (mode, submode) => `${mode}${capitalize(submode)}` as const
);

export type TResultMode = ReturnType<typeof selectResultMode>;
