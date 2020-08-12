import { createAction, createReducer } from "@reduxjs/toolkit";

export interface IUIReducer {
  guildDialog: boolean;
  focusChatArea: boolean;
}

export const initialState: IUIReducer = {
  guildDialog: false,
  focusChatArea: false,
};

export const setGuildDialogOpen = createAction<boolean>(
  "SET_GUILD_DIALOG_OPEN"
);

export const focusChatInput = createAction("FOCUS_CHAT_INPUT");

export const UIReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(setGuildDialogOpen, (state, action) => ({
      ...state,
      guildDialog: action.payload,
    }))
    .addCase(focusChatInput, (state) => ({
      ...state,
      focusChatArea: !state.focusChatArea,
    }))
);
