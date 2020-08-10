import { createAction, createReducer } from "@reduxjs/toolkit";

import { withPayload } from "./common";

/**
 * An entry in the guild list.
 */
export interface IListEntry {
  host: string;
  guildID: string;
}

/**
 * Data describing a channel
 */
export interface IChannel {
  name: string;
}

/**
 * Data describing a guild
 */
export interface IGuild {
  name?: string;
  picture?: string;
  owner?: string;
  channels?: {
    [id: string]: IChannel;
  };
  channelsList?: string[];
}

export interface IHostEntry {
  guilds?: {
    [id: string]: IGuild;
  };
}

/**
 * The app reducer's state type
 */
export interface IAppState {
  hosts: {
    [host: string]: IHostEntry;
  };
  guildsList: IListEntry[];
}

/**
 * The app reducer's state when the site loads
 */
export const initialAppState: IAppState = {
  hosts: {},
  guildsList: [],
};

export const addGuildToList = createAction<IListEntry>("ADD_GUILD_TO_LIST");

export const setGuildsList = createAction<IListEntry[]>("SET_GUILDS_LIST");

export const setGuild = createAction(
  "SET_GUILD",
  withPayload<{
    host: string;
    guildID: string;
    guild: IGuild;
  }>()
);

export const setChannelsList = createAction(
  "SET_CHANNELS_LIST",
  withPayload<{
    host: string;
    guildID: string;
    channelList: string[];
  }>()
);

export const setChannels = createAction(
  "SET_CHANNEL_DATA",
  withPayload<{
    host: string;
    guildID: string;
    channels: {
      [channelID: string]: IChannel;
    };
  }>()
);

export const appReducer = createReducer(initialAppState, (builder) =>
  builder
    .addCase(addGuildToList, (state, action) => ({
      ...state,
      guildsList: [...state.guildsList, action.payload],
    }))
    .addCase(setGuildsList, (state, action) => ({
      ...state,
      guildsList: action.payload,
    }))
    .addCase(setGuild, (state, action) => ({
      ...state,
      hosts: {
        ...state.hosts,
        [action.payload.host]: {
          ...state.hosts[action.payload.host],
          guilds: {
            ...state.hosts[action.payload.host]?.guilds,
            [action.payload.guildID]: {
              ...state.hosts[action.payload.host]?.guilds?.[
                action.payload.guildID
              ],
              ...action.payload.guild,
            },
          },
        },
      },
    }))
    .addCase(setChannelsList, (state, action) => ({
      ...state,
      hosts: {
        ...state.hosts,
        [action.payload.host]: {
          ...state.hosts[action.payload.host],
          guilds: {
            ...state.hosts[action.payload.host]?.guilds,
            [action.payload.guildID]: {
              ...state.hosts[action.payload.host]?.guilds?.[
                action.payload.guildID
              ],
              channelsList: action.payload.channelList,
            },
          },
        },
      },
    }))
    .addCase(setChannels, (state, action) => ({
      ...state,
      hosts: {
        ...state.hosts,
        [action.payload.host]: {
          ...state.hosts[action.payload.host],
          guilds: {
            ...state.hosts[action.payload.host]?.guilds,
            [action.payload.guildID]: {
              ...state.hosts[action.payload.host]?.guilds?.[
                action.payload.guildID
              ],
              channels: action.payload.channels,
            },
          },
        },
      },
    }))
);
