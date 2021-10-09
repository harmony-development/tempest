import { Store } from "./store";
import { session } from "./session";

export interface IGuildEntry {
  host: string;
  guildID: string;
}

interface IUserData {}

interface IMessageData {}

export interface IChannelData {
  messages: Record<string, IMessageData>;
}

export interface IGuildData {
  name?: string;
  owner?: string;
  picture?: string;
  channels: Record<string, IChannelData>;
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
  getHost(host: string) {
    host = host || session.value!.host;
    if (!this.state.hosts[host])
      this.state.hosts[host] = {
        guilds: {},
        users: {},
      };
    return this.state.hosts[host];
  }

  getGuild(host: string, guildID: string) {
    const h = this.getHost(host);
    if (!h.guilds[guildID])
      h.guilds[guildID] = {
        channels: {},
      };
    return h.guilds[guildID];
  }

  setGuildData(host: string, guildID: string, data: Partial<IGuildData>) {
    host = host || session.value!.host;
    const g = this.getGuild(host, guildID);
    this.state.hosts[host].guilds[guildID] = {
      ...g,
      ...data,
    };
  }
}

export const chatState = new ChatState({
  guildList: [],
  hosts: {},
});

// @ts-expect-error
window.chatState = chatState;
