import { Store } from "./store";
import { session } from "./session";
import { ChannelKind } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/channels";
import {
  Content,
  Overrides,
  Reaction,
} from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import { UserStatus } from "@harmony-dev/harmony-web-sdk/dist/gen/profile/v1/types";

export interface IGuildEntry {
  host: string;
  guildID: string;
}

interface IUserData {
  username: string;
  picture?: string;
  status: UserStatus;
}

export interface IMessageData {
  author: string;
  inReplyTo?: string;
  createdAt: string;
  editedAt?: string;
  content?: Content;
  reactions?: Reaction[];
  override?: Overrides;
}

export interface IChannelData {
  name?: string;
  kind?: ChannelKind;
  messages: Record<string, IMessageData>;
  messageList: string[];
  messagesFetched?: boolean;
}

export interface IGuildData {
  name?: string;
  owner?: string;
  picture?: string;
  channels: Record<string, IChannelData>;
  members: Set<string>;
  channelList: string[];
  channelFetched?: boolean;
}

export interface IHostData {
  guilds: Record<string, IGuildData>;
  users: Record<string, IUserData>;
}

export interface IChatState {
  guildList: IGuildEntry[];
  hosts: Record<string, IHostData>;
}

class ChatState extends Store<IChatState> {
  getHost(host?: string) {
    host = host || session.value!.host;
    if (!this.state.hosts[host])
      this.state.hosts[host] = {
        guilds: {},
        users: {},
      };
    return this.state.hosts[host];
  }

  getUser(host: string | undefined, userID: string) {
    const h = this.getHost(host);
    return h.users[userID];
  }

  getGuild(host: string, guildID: string) {
    const h = this.getHost(host);
    if (!h.guilds[guildID])
      h.guilds[guildID] = {
        channels: {},
        channelList: [],
        members: new Set(),
      };
    return h.guilds[guildID];
  }

  getChannel(host: string, guildID: string, channelID: string) {
    const g = this.getGuild(host, guildID);
    if (!g.channels[channelID])
      g.channels[channelID] = {
        messages: {},
        messageList: [],
      };
    return g.channels[channelID];
  }

  getMessage(
    host: string,
    guildID: string,
    channelID: string,
    messageID: string
  ) {
    return this.getChannel(host, guildID, channelID).messages[messageID];
  }

  setGuildChannels(host: string, guildID: string, channels: string[]) {
    const g = this.getGuild(host, guildID);
    g.channelList = channels;
  }

  setGuildData(host: string, guildID: string, data: Partial<IGuildData>) {
    const g = this.getGuild(host, guildID);
    this.getHost(host).guilds[guildID] = {
      ...g,
      ...data,
    };
  }

  setChannelData(
    host: string,
    guildID: string,
    channelID: string,
    data: Partial<IGuildData>
  ) {
    const g = this.getGuild(host, guildID);
    const c = this.getChannel(host, guildID, channelID);
    g.channels[channelID] = {
      ...c,
      ...data,
    };
  }

  setMessageData(
    host: string,
    guildID: string,
    channelID: string,
    messageID: string,
    data: IMessageData
  ) {
    const c = this.getChannel(host, guildID, channelID);
    c.messages[messageID] = data;
  }

  setMessageList(
    host: string,
    guildID: string,
    channelID: string,
    messageList: string[]
  ) {
    const c = this.getChannel(host, guildID, channelID);
    c.messageList = messageList;
  }

  addMessage(
    host: string,
    guildID: string,
    channelID: string,
    messageID: string,
    data: IMessageData
  ) {
    const c = this.getChannel(host, guildID, channelID);
    this.setMessageData(host, guildID, channelID, messageID, data);
    c.messageList.push(messageID);
  }
}

export const chatState = new ChatState({
  guildList: [],
  hosts: {},
});

// @ts-expect-error
window.chatState = chatState;