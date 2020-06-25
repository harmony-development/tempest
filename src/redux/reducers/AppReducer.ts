import { createAction, createReducer } from "@reduxjs/toolkit";

import { withPayloadType as withPayload, withPayloadType } from "./common";

export interface IGuild {
  id: string;
  name: string;
  picture: string;
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
  guildsList: IGuild[];
}

export const initialAppState: IAppState = {
  guildID: undefined,
  channelID: undefined,
  guilds: {},
  channels: {},
  guildsList: [
    {
      id: "asdfasfd",
      name: "Harmony Dev",
      picture: "as",
      host: "127.0.0.1",
    },
  ],
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

export const setGuildsList = createAction(
  "SET_GUILDS_LIST",
  withPayload<IGuild[]>()
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
    .addCase(setGuildsList, (state, action) => ({
      ...state,
      guildsList: action.payload,
    }))
);
