import { Epic, combineEpics } from "redux-observable";
import { AnyAction } from "@reduxjs/toolkit";

import { TRootState } from "~/state/root/root.reducer";
import { epic as lanternEpic } from "~/state/lantern/lantern.epics";

export type TEpic = Epic<AnyAction, AnyAction, TRootState>;

export const epic = combineEpics(lanternEpic);
