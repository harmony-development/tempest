import {
  StreamEvent as StreamChatEvent,
  StreamEventsResponse,
} from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/stream";
import { Handler } from "../util/oneof";
import { chatState } from "../store/chat";
import { convertMessageV1 } from "../conversions/messages";

const chatEventsHandler = new Handler<StreamChatEvent["event"]>({
  guildAddedToList(_, { guildAddedToList: guild }) {
    chatState.state.guildList.push({
      guildID: guild.guildId,
      host: guild.homeserver,
    });
  },
  guildRemovedFromList(_, { guildRemovedFromList: guild }) {
    chatState.state.guildList = chatState.state.guildList.filter(
      (g) => g.guildID !== guild.guildId || g.host !== guild.homeserver
    );
  },
  sentMessage(host, { sentMessage }) {
    chatState.addMessage(
      host,
      sentMessage.guildId,
      sentMessage.channelId,
      sentMessage.messageId,
      convertMessageV1(sentMessage.message!)
    );
  },
});

const streamEventsHandler = new Handler<StreamEventsResponse["event"]>({
  chat(host, { chat }) {
    chatEventsHandler.handle(host, chat.event);
  },
  profile(host, { profile }) {},
});

export function pubsub(host: string): (ev: StreamEventsResponse) => void {
  return ({ event }: StreamEventsResponse) => {
    streamEventsHandler.handle(host, event);
  };
}