import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import { rootReducer } from "./reducers/RootReducer";
import { appReducer } from "./reducers/AppReducer";

const combined = combineReducers({
  rootReducer,
  appReducer,
});

export const store = configureStore({
  reducer: combined,
});

export type RootDispatch = typeof store.dispatch;
export const useRootDispatch = () => useDispatch<RootDispatch>();
export type RootState = ReturnType<typeof store.getState>;
