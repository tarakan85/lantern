import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import * as lanterSlice from "~/state/lantern/lantern.slice";

const lanternPersistConfig = {
  key: lanterSlice.name,
  storage,
  whitelist: ["modeIndex", "submodeIndexes"],
};

export const reducer = combineReducers({
  [lanterSlice.name]: persistReducer(lanternPersistConfig, lanterSlice.reducer),
});

export type TRootState = ReturnType<typeof reducer>;
