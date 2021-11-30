import { computed } from "vue";
import { GetChannelMessagesRequest_Direction } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import { useAppRoute } from "./location";
import { getOrFederate } from "./connections";
import { appState } from "~/store/app";
import { IMessageData } from "~/store/types/message";

export const useUser = (
  userID: string | undefined,
  host: string | undefined
) => {
  return computed(() =>
    host && userID ? appState.getUser(host, userID) : undefined
  );
};

export const useMessage = (host: string, messageID: string) => {
  return computed(() => appState.getMessage(host, messageID));
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
      direction: GetChannelMessagesRequest_Direction.BEFORE_UNSPECIFIED,
      messageId: msgID || "0"
    });
    appState.setReachedTop(host, channelID, resp.response.reachedTop);
    appState.setMessageData(
      host,
      resp.response.messages.reduce<{
        [messageID: string]: IMessageData;
      }>((obj, m) => {
        obj[m.messageId] = {
          author: m.message!.authorId,
          createdAt: Number(m.message!.createdAt),
          editedAt: Number(m.message!.editedAt),
          content: m.message!.content!,
          pending: false,
          override: {
            username: m.message!.overrides?.username,
            avatar: m.message!.overrides?.avatar,
            reason: m.message!.overrides?.reason.oneofKind,
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
