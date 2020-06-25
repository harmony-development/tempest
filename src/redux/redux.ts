import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import { rootReducer } from "./reducers/RootReducer";
import { appReducer } from "./reducers/AppReducer";
import { UIReducer } from "./reducers/UIReducer";

const combined = combineReducers({
  rootReducer,
  appReducer,
  UIReducer,
});

export const store = configureStore({
  reducer: combined,
});

export type RootDispatch = typeof store.dispatch;
export const useRootDispatch = () => useDispatch<RootDispatch>();
export type RootState = ReturnType<typeof store.getState>;
