import { createAction, createReducer } from "@reduxjs/toolkit";

import { withPayloadType as withPayload } from "./common";

export interface IAppState {
  guildID?: string;
  channelID?: string;
}

export const initialAppState: IAppState = {
  guildID: undefined,
  channelID: undefined,
};

export const setGuildID = createAction(
  "SET_GUILD_ID",
  withPayload<string | undefined>()
);
export const setChannelID = createAction(
  "SET_CHANNEL_ID",
  withPayload<string | undefined>()
);

export const appReducer = createReducer(initialAppState, (builder) =>
  builder
    .addCase(setGuildID, (state, action) => ({
      ...state,
      guildID: action.payload,
    }))
    .addCase(setChannelID, (state, action) => ({
      ...state,
      channelID: action.payload,
    }))
);
