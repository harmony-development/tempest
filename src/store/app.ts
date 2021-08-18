import {
  FetchLinkMetadataResponse,
  MediaMetadata,
} from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/mediaproxy/v1/mediaproxy";
import { Store } from "./store";
import { IChannelData } from "./types/channel";
import { IGuildData, IGuildInfo } from "./types/guild";
import { IMessageData } from "./types/message";
import { IUserData } from "./types/user";

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
      users: {
        [userid: string]: IUserData;
      };
    };
  };
  linkPreviews: {
    [url: string]: FetchLinkMetadataResponse["data"];
  };
}

class AppState extends Store<IAppState> {
  getHost(host: string) {
    if (!this.state.data[host])
      this.state.data[host] = {
        guilds: {},
        channels: {},
        messages: {},
        users: {},
      };
    return this.state.data[host];
  }

  getPreview(url: string) {
    return this.state.linkPreviews[url];
  }

  setPreview(url: string, preview: FetchLinkMetadataResponse["data"]) {
    this.state.linkPreviews[url] = preview;
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

  getUser(host: string, userID: string) {
    const data = this.getHost(host);
    return data.users[userID];
  }

  setGuildInfo(host: string, guildID: string, info: IGuildInfo) {
    const data = this.getGuild(host, guildID);
    Object.assign(data, info);
  }

  setGuildMembers(host: string, guildID: string, members: string[]) {
    this.getGuild(host, guildID).members = members;
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

  setChannelMessages(
    host: string,
    channelID: string,
    messages: string[],
    prepend?: boolean
  ) {
    const chan = this.getChannel(host, channelID);
    if (prepend) chan.messages?.unshift(...messages);
    else chan.messages = messages;
  }

  setReachedTop(host: string, channelID: string, reachedTop: boolean) {
    this.getChannel(host, channelID).reachedTop = reachedTop;
  }

  addMessage(
    host: string,
    channelID: string,
    messageID: string,
    data: IMessageData
  ) {
    this.getHost(host).messages[messageID] = data;
    this.getChannel(host, channelID).messages?.push(messageID);
  }

  deleteMessage(host: string, channelID: string, messageID: string) {
    delete this.getHost(host).messages[messageID];
    const msgs = this.getChannel(host, channelID).messages;
    msgs?.splice(msgs.indexOf(messageID), 1);
  }

  updateMessage(
    host: string,
    messageID: string,
    messageData: Partial<IMessageData>
  ) {
    Object.assign(this.getHost(host).messages[messageID], messageData);
  }

  setUserData(
    host: string,
    users: {
      [userid: string]: IUserData;
    }
  ) {
    const hostData = this.getHost(host);
    Object.assign(hostData.users, users);
  }

  updateUser(host: string, userID: string, userData: Partial<IUserData>) {
    Object.assign(this.getHost(host).users[userID], userData);
  }
}

export const appState = new AppState({
  data: {},
  linkPreviews: {},
});

// @ts-ignore
window.appState = appState;
