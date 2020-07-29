import { createAction, createReducer } from "@reduxjs/toolkit";

import { withPayload } from "./common";

/**
 * Data describing a guild
 */
export interface IGuild {
  name?: string;
  picture?: string;
  owner?: string;
}

/**
 * An entry in the guild list.
 */
export interface IListEntry {
  host: string;
  guildID: string;
}

/**
 * We don't want to run the risk of colliding snoflakes between homeservers, so we need to use a composite key to keep them distinct
 * @param entry a list entry that you want to turn into a composite key
 * @returns a composite key with the guild ID and the host
 */
export function compositeKey(entry: IListEntry) {
  return `${entry.guildID}|${entry.host}`;
}

/**
 * The app reducer's state type
 */
export interface IAppState {
  host?: string;
  guildID?: string;
  channelID?: string;
  guilds: {
    [key: string]: IGuild;
  };
  guildsList: IListEntry[];
}

/**
 * The app reducer's state when the site loads
 */
export const initialAppState: IAppState = {
  guildID: undefined,
  channelID: undefined,
  guilds: {},
  guildsList: [],
};

export const addGuildToList = createAction(
  "ADD_GUILD_TO_LIST",
  withPayload<IListEntry>()
);

export const setGuildsList = createAction(
  "SET_GUILDS_LIST",
  withPayload<IListEntry[]>()
);

export const setGuild = createAction(
  "SET_GUILD",
  withPayload<{
    entry: IListEntry;
    guild: IGuild;
  }>()
);

export const setCurrentGuildID = createAction<string | undefined>(
  "SET_CURRENT_GUILD_ID"
);

export const setCurrentChannelID = createAction<string | undefined>(
  "SET_CURRENT_CHANNEL_ID"
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
      guilds: {
        [compositeKey(action.payload.entry)]: action.payload.guild,
      },
    }))
);
