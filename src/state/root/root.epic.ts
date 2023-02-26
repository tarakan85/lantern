import { Epic, combineEpics } from "redux-observable";
import { AnyAction } from "@reduxjs/toolkit";

import { TRootState } from "~/state/root/root.reducer";
import * as lanternEpics from "~/state/lantern/lantern.epics";

export type TEpic = Epic<AnyAction, AnyAction, TRootState>;

export const epic = combineEpics(
  lanternEpics.togglePower,
  lanternEpics.switchSubmode,
  lanternEpics.switchMode,
  lanternEpics.showChargingIndicator,
  lanternEpics.hideChargingIndicator
);
