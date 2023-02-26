import { combineReducers } from "@reduxjs/toolkit";

import * as lanterSlice from "~/state/lantern/lantern.slice";

export const reducer = combineReducers({
  [lanterSlice.name]: lanterSlice.reducer,
});

export type TRootState = ReturnType<typeof reducer>;
