import { Store } from "./store";
import { IChannelData } from "./types/channel";
import { IGuildData, IGuildInfo } from "./types/guild";

interface IAppState {
  data: {
    [host: string]: {
      guilds: {
        [guildid: string]: IGuildData & IGuildInfo;
      };
      channels: {
        [channelid: string]: IChannelData;
      };
    };
  };
}

class AppState extends Store<IAppState> {
  getHost(host: string) {
    if (!this.state.data[host])
      this.state.data[host] = { guilds: {}, channels: {} };
    return this.state.data[host];
  }

  getGuild(host: string, guildID: string) {
    const data = this.getHost(host);
    if (!data.guilds[guildID]) data.guilds[guildID] = {};
    return data.guilds[guildID];
  }

  getChannel(host: string, channelID: string) {
    const data = this.getHost(host);
    if (!data.channels[channelID]) data.channels[channelID] = {};
    return data.channels[channelID];
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
    const data = this.getHost(host);
    Object.assign(data.channels, channels);
  }
}

export const appState = new AppState({
  data: {},
});
