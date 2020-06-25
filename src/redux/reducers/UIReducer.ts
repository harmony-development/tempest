import { createAction, createReducer } from "@reduxjs/toolkit";

export interface IUIReducer {
  guildDialog: boolean;
}

export const initialState: IUIReducer = {
  guildDialog: false,
};

export const setGuildDialogOpen = createAction<boolean>(
  "SET_GUILD_DIALOG_OPEN"
);

export const UIReducer = createReducer(initialState, (builder) =>
  builder.addCase(setGuildDialogOpen, (state, action) => ({
    ...state,
    guildDialog: action.payload,
  }))
);
