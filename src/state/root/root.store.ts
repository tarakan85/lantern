import { configureStore, AnyAction } from "@reduxjs/toolkit";
import { createEpicMiddleware } from "redux-observable";
import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import { TRootState } from "./root.types";
import { epic } from "./root.epic";
import { reducer } from "./root.reducer";

const epicMiddleware = createEpicMiddleware<AnyAction, AnyAction, TRootState>();

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: true,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(epicMiddleware),
});

epicMiddleware.run(epic);

export const persistor = persistStore(store);

export type TAppDispatch = typeof store.dispatch;
