import { Store } from "./store";
import { IChannelData } from "./types/channel";
import { IGuildData, IGuildInfo } from "./types/guild";
import { IMessageData } from "./types/message";

interface IAppState {
  data: {
    [host: string]: {
      guilds: {
        [guildid: string]: IGuildData & IGuildInfo;
      };
      channels: {
        [channelid: string]: IChannelData;
      };
      messages: {
        [messageid: string]: IMessageData;
      };
    };
  };
}

class AppState extends Store<IAppState> {
  getHost(host: string) {
    if (!this.state.data[host])
      this.state.data[host] = { guilds: {}, channels: {}, messages: {} };
    return this.state.data[host];
  }

  getGuild(host: string, guildID: string) {
    const data = this.getHost(host);
    if (!data.guilds[guildID]) data.guilds[guildID] = {};
    return data.guilds[guildID];
  }

  getChannel(host: string, channelID: string) {
    const data = this.getHost(host);
    if (!data.channels[channelID]) {
      data.channels[channelID] = {};
    }
    return data.channels[channelID];
  }

  getMessage(host: string, messageID: string) {
    return this.getHost(host).messages[messageID];
  }

  setGuildInfo(host: string, guildID: string, info: IGuildInfo) {
    const data = this.getGuild(host, guildID);
    Object.assign(data, info);
  }

  setGuildChannels(host: string, guildID: string, channels: string[]) {
    const guild = this.getGuild(host, guildID);
    guild.channels = channels;
  }

  setChannelData(
    host: string,
    channels: {
      [channelID: string]: IChannelData;
    }
  ) {
    const hostData = this.getHost(host);
    for (const [channelID, data] of Object.entries(channels)) {
      const channel = this.getChannel(host, channelID);
      Object.assign(channel, data);
    }
  }

  setMessageData(
    host: string,
    messages: {
      [messageid: string]: IMessageData;
    }
  ) {
    const hostData = this.getHost(host);
    Object.assign(hostData.messages, messages);
  }

  setChannelMessages(host: string, channelID: string, messages: string[]) {
    const chan = this.getChannel(host, channelID);
    chan.messages = messages;
  }
}

export const appState = new AppState({
  data: {},
});

// @ts-ignore
window.appState = appState;
