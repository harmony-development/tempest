import { Connection } from "@harmony-dev/harmony-web-sdk";
import {
  GuildEvent,
  Message,
} from "@harmony-dev/harmony-web-sdk/dist/protocol/core/v1/core_pb";
import { grpc } from "@improbable-eng/grpc-web";
import { useQuery, useInfiniteQuery, useMutation } from "react-query";
import { queryCache } from "..";

export class Comms {
  static homeserver: string;
  static connections: {
    [host: string]: Connection;
  } = {};

  static getHomeserverConn() {
    return this.connections[this.homeserver];
  }

  static async getOrFederate(host: string) {
    if (!this.connections[host]) {
      const resp = await this.getHomeserverConn().federate(host);
      const newConn = new Connection(host);
      await newConn.loginFederated(resp.message?.getToken() || "", host);
      this.connections[host] = newConn;
      Comms.bindEvents(newConn);
    }
    return this.connections[host];
  }

  static onMessage(host: string, event: GuildEvent.MessageSent) {
    const { message } = event.toObject();
    if (message?.location && message.createdAt) {
      console.log("hi");
    }
  }

  static onDisconnect(
    code: grpc.Code,
    message: string,
    trailers: grpc.Metadata
  ) {
    console.log(message);
  }

  static bindEvents(c: Connection) {
    c.events.on(GuildEvent.EventCase.SENT_MESSAGE, this.onMessage);
    c.events.on("disconnect", this.onDisconnect);
  }
}

export const useGuildList = () => {
  return useQuery("guildlist", async () => {
    const data = await Comms.getHomeserverConn().getGuildList();
    return data.message?.toObject().guildsList;
  });
};

export const useGuildData = (guildID: string, host: string) => {
  return useQuery(
    ["guilddata", host, guildID],
    async () => {
      const conn = await Comms.getOrFederate(host);
      const data = await conn.getGuild(guildID);
      return data.message?.toObject();
    },
    {
      enabled: guildID && host,
    }
  );
};

export const useChannelList = (host?: string, guildID?: string) => {
  return useQuery(["channellist", host, guildID], async () => {
    if (!host || !guildID) return [];
    const conn = await Comms.getOrFederate(host);
    const data = await conn.getGuildChannels(guildID);
    return data.message?.toObject().channelsList;
  });
};

export const useMessages = (
  host?: string,
  guildID?: string,
  channelID?: string
) => {
  let hasReachedTop = false;

  return useInfiniteQuery(
    ["messages", host, guildID, channelID],
    async (key, _host, _guildid, _channelid, messageID: string) => {
      console.log(key, messageID);
      if (!host || !guildID || !channelID) return [];
      const conn = await Comms.getOrFederate(host);
      const msgs = (
        await conn.getChannelMessages(guildID, channelID, messageID)
      )?.message
        ?.toObject()
        .messagesList.reverse();
      if (msgs?.length === 0) hasReachedTop = true;
      return msgs;
    },
    {
      getFetchMore: () => !hasReachedTop,
    }
  );
};

export const useUserData = (userID: string, host: string) => {
  return useQuery(
    ["userdata", host, userID],
    async () => {
      const conn = await Comms.getOrFederate(host);
      const data = await conn.getUser(userID);
      return data.message?.toObject();
    },
    {
      enabled: userID && host,
    }
  );
};

export const useDeleteMessage = (
  host: string,
  guildID: string,
  channelID: string,
  messageID: string,
  pageIndex: number,
  messageIndex: number
) => {
  const messageListKey = ["messages", host, guildID, channelID];
  return useMutation(
    async () => {
      const conn = await Comms.getOrFederate(host);
      await conn.deleteMessage(guildID, channelID, messageID);
    },
    {
      onSuccess: () => {
        const pages = queryCache.getQueryData<Message.AsObject[][]>(
          messageListKey
        );
        pages?.[pageIndex]?.splice(messageIndex, 1);
        queryCache.setQueryData(messageListKey, pages);
      },
    }
  );
};
