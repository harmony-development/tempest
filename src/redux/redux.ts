import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import { rootReducer } from "./reducers/RootReducer";

export const store = configureStore({
  reducer: rootReducer,
});

export type RootDispatch = typeof store.dispatch;
export const useRootDispatch = () => useDispatch<RootDispatch>();
export type RootState = ReturnType<typeof store.getState>;
