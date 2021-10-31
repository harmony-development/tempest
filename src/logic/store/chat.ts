import { Store } from "./store";
import { session } from "./session";
import { ChannelKind } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/channels";
import {
  Content,
  Overrides,
  Reaction,
} from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import { UserStatus } from "@harmony-dev/harmony-web-sdk/dist/gen/profile/v1/types";
import { connectionManager } from "../api/connections";
import { convertMessageV1 } from "../conversions/messages";
import { AsyncLock } from "../util/asyncLock";

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
  name: string;
  kind: ChannelKind;
}

export interface IChannel {
  data?: IChannelData;
  messages: Record<string, IMessageData>;
  messageList: string[];
}

export interface IGuildData {
  name: string;
  owners: string[];
  picture?: string;
}

export interface IGuild {
  data?: IGuildData;
  channels: Record<string, IChannel>;
  members: Set<string>;
  channelList?: string[];
}

export interface IHostData {
  guilds: Record<string, IGuild>;
  users: Record<string, IUserData>;
}

export interface IChatState {
  guildList: IGuildEntry[];
  hosts: Record<string, IHostData>;
}

class ChatState extends Store<IChatState> {
  private lock: AsyncLock;

  constructor(data: IChatState) {
    super(data);
    this.lock = new AsyncLock();
  }

  private ensureHost(host?: string) {
    host = host || session.value!.host;
    if (!this.state.hosts[host])
      this.state.hosts[host] = {
        guilds: {},
        users: {},
      };
    return this.state.hosts[host];
  }

  private ensureGuild(host: string, guildID: string) {
    const h = this.ensureHost(host);
    if (!h.guilds[guildID])
      h.guilds[guildID] = {
        channels: {},
        members: new Set(),
      };
    return h.guilds[guildID];
  }

  private ensureChannel(host: string, guildID: string, channelID: string) {
    const g = this.ensureGuild(host, guildID);
    if (!g.channels[channelID])
      g.channels[channelID] = {
        messages: {},
        messageList: [],
      };
    return g.channels[channelID];
  }

  getUser(host: string, userId: string) {
    const h = this.ensureHost(host);
    this.lock.run(async () => {
      const { profile } = await connectionManager.get(host).profile.getProfile({
        userId,
      }).response;
      h.users[userId] = {
        username: profile!.userName,
        picture: profile?.userAvatar,
        status: profile!.userStatus,
      };
    }, ["user", host, userId]);
    return h.users[userId];
  }

  getGuild(host: string, guildId: string) {
    const g = this.ensureGuild(host, guildId);
    this.lock.run(async () => {
      const conn = connectionManager.get(host);
      const { guild } = await conn.chat.getGuild({ guildId }).response;
      console.log(guild);
      g.data = {
        name: guild!.name,
        picture: guild?.picture,
        owners: guild!.ownerIds,
      };
    }, ["guild", host, guildId]);
    return g;
  }

  getMemberList(host: string, guildId: string) {
    const g = this.ensureGuild(host, guildId);
    this.lock.run(async () => {
      const conn = connectionManager.get(host);
      const { members } = await conn.chat.getGuildMembers({ guildId }).response;
      members.forEach((m) => g.members.add(m));
    }, ["memberList", host, guildId]);
    return g.members;
  }

  getChannelList(host: string, guildId: string) {
    const g = this.ensureGuild(host, guildId);

    this.lock.run(async () => {
      const { channels } = await connectionManager
        .get(host)
        .chat.getGuildChannels({ guildId }).response;
      for (const { channel, channelId } of channels) {
        this.ensureChannel(host, guildId, channelId).data = {
          name: channel!.channelName,
          kind: channel!.kind,
        };
      }
      g.channelList = channels.map((c) => c.channelId);
    }, ["channelList", host, guildId]);

    return g.channelList;
  }

  getMessageList(host: string, guildId: string, channelId: string) {
    const c = this.ensureChannel(host, guildId, channelId);
    this.lock.run(async () => {
      const { messages } = await connectionManager
        .get(host)
        .chat.getChannelMessages({
          guildId,
          channelId,
          messageId: "0",
        }).response;
      for (const { message, messageId } of messages) {
        c.messages[messageId] = convertMessageV1(message!);
      }
      c.messageList = messages.map((m) => m.messageId).reverse();
    }, ["messageList", host, guildId, channelId]);

    return c.messageList;
  }

  getChannel(host: string, guildId: string, channelId: string) {
    const c = this.ensureChannel(host, guildId, channelId);
    return c;
  }

  getMessage(
    host: string,
    guildID: string,
    channelID: string,
    messageID: string
  ) {
    return this.ensureChannel(host, guildID, channelID).messages[messageID];
  }

  setGuildChannels(host: string, guildID: string, channels: string[]) {
    const g = this.ensureGuild(host, guildID);
    g.channelList = channels;
  }

  setGuildData(host: string, guildID: string, data: Partial<IGuild>) {
    const g = this.ensureGuild(host, guildID);
    this.ensureHost(host).guilds[guildID] = {
      ...g,
      ...data,
    };
  }

  setChannelData(
    host: string,
    guildID: string,
    channelID: string,
    data: Partial<IChannelData>
  ) {
    const g = this.ensureGuild(host, guildID);
    const c = this.ensureChannel(host, guildID, channelID);
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
    const c = this.ensureChannel(host, guildID, channelID);
    c.messages[messageID] = data;
  }

  setMessageList(
    host: string,
    guildID: string,
    channelID: string,
    messageList: string[]
  ) {
    const c = this.ensureChannel(host, guildID, channelID);
    c.messageList = messageList;
  }

  addMessage(
    host: string,
    guildID: string,
    channelID: string,
    messageID: string,
    data: IMessageData
  ) {
    const c = this.ensureChannel(host, guildID, channelID);
    this.setMessageData(host, guildID, channelID, messageID, data);
    c.messageList.push(messageID);
  }

  addChannel(
    host: string,
    guildID: string,
    channelID: string,
    data: IChannelData
  ) {
    const g = this.getGuild(host, guildID);
    const c = this.ensureChannel(host, guildID, channelID);
    c.data = data;
    g.channelList?.push(channelID);
  }
}

export const chatState = new ChatState({
  guildList: [],
  hosts: {},
});

// @ts-expect-error
window.chatState = chatState;
