import { Store } from "./store";
import { IChannelData } from "./types/channel";
import { IGuildData, IGuildInfo } from "./types/guild";

interface IAppState {
  data: {
    [host: string]: {
      guilds: {
        [guildid: number]: IGuildData & IGuildInfo;
      };
      channels: {
        [channelid: number]: IChannelData;
      };
    };
  };
}

class AppState extends Store<IAppState> {
  getHost(host: string) {
    return (
      this.state.data[host] ||
      (this.state.data[host] = { guilds: {}, channels: {} })
    );
  }

  getGuild(host: string, guildID: number) {
    const data = this.getHost(host);
    return data.guilds[guildID] || (data.guilds[guildID] = {});
  }

  setGuildInfo(host: string, guildID: number, info: IGuildInfo) {
    const data = this.getGuild(host, guildID);
    Object.assign(data, info);
  }

  setGuildChannels(host: string, guildID: number, channels: number[]) {
    const guild = this.getGuild(host, guildID);
    guild.channels = channels;
  }
}

export const appState = new AppState({
  data: {},
});
