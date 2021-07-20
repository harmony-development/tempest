import { computed } from "vue";
import { useAppRoute } from "./location";
import { getOrFederate } from "./connections";
import { appState } from "~/store/app";
import { IUserData } from "~/store/types/user";
import { IChannelData } from "~/store/types/channel";
import { IMessageData } from "~/store/types/message";

export const useMemberList = () => {
  const route = useAppRoute();
  return computed(
    () => appState.getGuild(route.value.host, route.value.guildid).members
  );
};

export const useFetchMembers = () => {
  return async (host: string | undefined, guildid: string | undefined) => {
    if (!host || !guildid) return;
    const conn = await getOrFederate(host);
    const members = await conn.chat.getGuildMembers({
      guildId: guildid,
    });
    const data = await conn.chat.getUserBulk({
      userIds: members.response.members.filter((v) => v !== "0"),
    });
    appState.setUserData(
      host,
      data.response.users.reduce<{
        [userid: string]: IUserData;
      }>((obj, u, idx) => {
        obj[members.response.members[idx]] = {
          username: u.userName,
          avatar: u.userAvatar,
          status: u.userStatus,
          bot: u.isBot,
        };
        return obj;
      }, {})
    );
    appState.setGuildMembers(host, guildid as string, members.response.members);
  };
};

export const useChannelList = () => {
  const route = useAppRoute();
  return computed(
    () => appState.getGuild(route.value.host, route.value.guildid).channels
  );
};

export const useFetchChannelList = () => {
  const channelList = useChannelList();
  return async (host: string | undefined, guildID: string | undefined) => {
    if (channelList.value) return;
    if (!host || !guildID) return;
    const conn = await getOrFederate(host);
    const resp = await conn.chat.getGuildChannels({
      guildId: guildID as string,
    });
    appState.setGuildChannels(
      host,
      guildID,
      resp.response.channels.map((c) => c.channelId)
    );
    appState.setChannelData(
      host,
      resp.response.channels.reduce<{
        [channelID: string]: IChannelData;
      }>((obj, c) => {
        obj[c.channelId] = {
          name: c.channelName,
          kind: "text",
          unread: false,
          typing: {},
        };
        return obj;
      }, {})
    );
  };
};

export const useMessageList = () => {
  const route = useAppRoute();
  return computed(
    () => appState.getChannel(route.value.host, route.value.channelid).messages
  );
};

export const useFetchMessages = () => {
  return async (
    host: string | undefined,
    guildID: string | undefined,
    channelID: string | undefined,
    msgID?: string
  ) => {
    if (!host || !channelID || !guildID) return;
    const conn = await getOrFederate(host);
    const resp = await conn.chat.getChannelMessages({
      guildId: guildID,
      channelId: channelID,
      beforeMessage: msgID || "0",
    });
    appState.setReachedTop(host, channelID, resp.response.reachedTop);
    appState.setMessageData(
      host,
      resp.response.messages.reduce<{
        [messageID: string]: IMessageData;
      }>((obj, m) => {
        obj[m.messageId] = {
          author: m.authorId,
          createdAt: Number(m.createdAt?.seconds),
          editedAt: Number(m.editedAt?.seconds),
          content: m.content!,
          pending: false,
          override: {
            username: m.overrides?.name,
            avatar: m.overrides?.avatar,
            reason: m.overrides?.reason.oneofKind,
          },
        };
        return obj;
      }, {})
    );
    appState.setChannelMessages(
      host,
      channelID,
      resp.response.messages.map((msg) => msg.messageId).reverse(),
      !!msgID
    );
  };
};
