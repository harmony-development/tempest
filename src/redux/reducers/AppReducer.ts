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
 * Data describing a message
 */
export interface IMessage {
  authorID: string;
  createdAt: number;
  content: string;
}

/**
 * Data describing a channel
 */
export interface IChannel {
  name?: string;
  reachedTop?: boolean;
  messageList?: string[];
}

/**
 * Data describing a guild
 */
export interface IGuild {
  name?: string;
  picture?: string;
  owner?: string;
  selectedChannel?: string;
  channelsList?: string[];
}

export interface IHostEntry {
  guilds?: {
    [id: string]: IGuild;
  };
  channels?: {
    [id: string]: IChannel;
  };
  messages?: {
    [id: string]: IMessage;
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

export const setSelectedChannel = createAction(
  "SET_SELECTED_CHANNEL",
  withPayload<{
    host: string;
    guildID: string;
    channelID: string;
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

export const setMessagesList = createAction(
  "SET_MESSAGES_LIST",
  withPayload<{
    host: string;
    channelID: string;
    messageList: string[];
  }>()
);

export const setMessages = createAction(
  "SET_MESSAGES",
  withPayload<{
    host: string;
    messages: {
      [id: string]: IMessage;
    };
  }>()
);

export const addMessage = createAction(
  "ADD_MESSAGE",
  withPayload<{
    host: string;
    channelID: string;
    messageID: string;
    message: IMessage;
  }>()
);

export const addMessages = createAction(
  "ADD_MESSAGES",
  withPayload<{
    host: string;
    channelID: string;
    messages: {
      [messageID: string]: IMessage;
    };
  }>()
);

export const setReachedTop = createAction(
  "SET_REACHED_TOP",
  withPayload<{
    host: string;
    channelID: string;
    reachedTop: boolean;
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
    .addCase(setSelectedChannel, (state, action) => ({
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
              selectedChannel: action.payload.channelID,
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
    .addCase(setMessagesList, (state, action) => ({
      ...state,
      hosts: {
        ...state.hosts,
        [action.payload.host]: {
          ...state.hosts[action.payload.host],
          channels: {
            ...state.hosts[action.payload.host].channels,
            [action.payload.channelID]: {
              ...state.hosts[action.payload.host].channels?.[
                action.payload.channelID
              ],
              messageList: action.payload.messageList,
            },
          },
        },
      },
    }))
    .addCase(setMessages, (state, action) => ({
      ...state,
      hosts: {
        ...state.hosts,
        [action.payload.host]: {
          ...state.hosts[action.payload.host],
          messages: {
            ...state.hosts[action.payload.host]?.messages,
            ...action.payload.messages,
          },
        },
      },
    }))
    .addCase(addMessage, (state, action) => ({
      ...state,
      hosts: {
        ...state.hosts,
        [action.payload.host]: {
          ...state.hosts[action.payload.host],
          messages: {
            ...state.hosts[action.payload.host]?.messages,
            [action.payload.messageID]: action.payload.message,
          },
          channels: {
            ...state.hosts[action.payload.host].channels,
            [action.payload.channelID]: {
              ...state.hosts[action.payload.host].channels?.[
                action.payload.channelID
              ],
              messageList: [
                ...(state.hosts[action.payload.host].channels?.[
                  action.payload.channelID
                ]?.messageList || []),
                action.payload.messageID,
              ],
            },
          },
        },
      },
    }))
    .addCase(addMessages, (state, action) => ({
      ...state,
      hosts: {
        ...state.hosts,
        [action.payload.host]: {
          ...state.hosts[action.payload.host],
          messages: {
            ...state.hosts[action.payload.host]?.messages,
            ...action.payload.messages,
          },
          channels: {
            ...state.hosts[action.payload.host].channels,
            [action.payload.channelID]: {
              ...state.hosts[action.payload.host].channels?.[
                action.payload.channelID
              ],
            },
          },
        },
      },
    }))
    .addCase(setReachedTop, (state, action) => ({
      ...state,
      hosts: {
        ...state.hosts,
        [action.payload.host]: {
          ...state.hosts[action.payload.host],
          channels: {
            ...state.hosts[action.payload.host].channels,
            [action.payload.channelID]: {
              ...state.hosts[action.payload.host].channels?.[
                action.payload.channelID
              ],
              reachedTop: action.payload.reachedTop,
            },
          },
        },
      },
    }))
);
