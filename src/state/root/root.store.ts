import { configureStore, AnyAction } from "@reduxjs/toolkit";
import { createEpicMiddleware } from "redux-observable";
import { TRootState } from "./root.types";

import { epic } from "./root.epic";
import { reducer } from "./root.reducer";

const epicMiddleware = createEpicMiddleware<AnyAction, AnyAction, TRootState>();

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: true,
    }).concat(epicMiddleware),
});

epicMiddleware.run(epic);

export type TAppDispatch = typeof store.dispatch;
