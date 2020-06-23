import { createAction, createReducer } from "@reduxjs/toolkit";

import { withPayloadType as withPayload, withPayloadType } from "./common";

export interface IGuild {
  name: string;
  host: string;
}

export interface IChannel {
  name: string;
}

export interface IAppState {
  guildID?: string;
  channelID?: string;
  guilds: {
    [key: string]: IGuild;
  };
  channels: {
    [key: string]: IChannel;
  };
}

export const initialAppState: IAppState = {
  guildID: undefined,
  channelID: undefined,
  guilds: {},
  channels: {},
};

export const setGuildID = createAction(
  "SET_GUILD_ID",
  withPayload<string | undefined>()
);
export const setChannelID = createAction(
  "SET_CHANNEL_ID",
  withPayload<string | undefined>()
);

export const setGuilds = createAction(
  "SET_GUILDS",
  withPayloadType<{
    [key: string]: IGuild;
  }>()
);

export const addGuild = createAction(
  "ADD_GUILD",
  withPayload<{
    id: string;
    guild: IGuild;
  }>()
);

export const setChannels = createAction(
  "SET_GUILDS",
  withPayloadType<{
    [key: string]: IChannel;
  }>()
);

export const addChannel = createAction(
  "ADD_GUILD",
  withPayload<{
    id: string;
    channel: IChannel;
  }>()
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
    .addCase(setGuilds, (state, action) => ({
      ...state,
      guilds: action.payload,
    }))
    .addCase(addGuild, (state, action) => ({
      ...state,
      guilds: {
        ...state.guilds,
        // lol composite key to prevent people from having meme duplicate guild IDs
        [`${action.payload.id},${action.payload.guild}`]: action.payload.guild,
      },
    }))
);
