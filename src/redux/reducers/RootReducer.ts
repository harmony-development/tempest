import { PaletteType, PaletteColorOptions } from "@material-ui/core";
import { purple, indigo } from "@material-ui/core/colors";
import { createAction, createReducer } from "@reduxjs/toolkit";

export interface IRootState {
  theme: {
    type: PaletteType;
    primary: PaletteColorOptions;
    secondary: PaletteColorOptions;
  };
}

export const initialState: IRootState = {
  theme: {
    type: "dark",
    primary: {
      light: purple[300],
      main: purple[400],
      dark: purple[500],
    },
    secondary: {
      light: indigo[300],
      main: indigo[400],
      dark: indigo[500],
    },
  },
};

export const setThemeType = createAction<PaletteType>("SET_THEME_TYPE");
export const setPrimary = createAction<PaletteColorOptions>("SET_PRIMARY");
export const setSecondary = createAction<PaletteColorOptions>("SET_SECONDARY");

export const rootReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(setThemeType, (state, action) => ({
      ...state,
      theme: {
        ...state.theme,
        type: action.payload,
      },
    }))
    .addCase(setPrimary, (state, action) => ({
      ...state,
      theme: {
        ...state.theme,
        primary: action.payload,
      },
    }))
    .addCase(setSecondary, (state, action) => ({
      ...state,
      theme: {
        ...state.theme,
        secondary: action.payload,
      },
    }))
);
