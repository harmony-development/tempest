import {
  StreamEvent as StreamChatEvent,
  StreamEventsResponse,
} from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/stream";
import { ChatRoute, router } from "../../router";
import { convertMessageV1 } from "../conversions/messages";
import { parseHMC } from "../parsing";
import { chatState } from "../store/chat";
import { Handler } from "../util/oneof";

let notifsGranted = false;

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
  createdChannel(host, { createdChannel }) {
    chatState.addChannel(
      host,
      createdChannel.guildId,
      createdChannel.channelId,
      {
        name: createdChannel.name,
        kind: 0,
      }
    );
  },
  async sentMessage(host, { sentMessage }) {
    chatState.addMessage(
      host,
      sentMessage.guildId,
      sentMessage.channelId,
      sentMessage.messageId,
      convertMessageV1(sentMessage.message!)
    );
    const guild = chatState.getGuild(host, sentMessage.guildId);
    const channel = chatState.getChannel(
      host,
      sentMessage.guildId,
      sentMessage.channelId
    );
    const msg = sentMessage.message!;
    const content = msg.content?.content;
    const user = chatState.getUser(host, msg.authorId);
    const photoSource = msg.overrides?.avatar || user.picture;

    const title = `${user.username} in #${
      channel.data?.name || "unknown-channel"
    } (${guild.data?.name})`;

    let text: string | undefined;
    let photo = photoSource ? parseHMC(photoSource, host) : undefined;
    switch (content?.oneofKind) {
      case "textMessage":
        text = content.textMessage.content?.text;
        break;
      case "photoMessage":
        text = `Uploaded ${content.photoMessage.photos
          .map((p) => p.name)
          .join(", ")}`;
        break;
      case "attachmentMessage":
        text = `Uploaded ${content.attachmentMessage.files
          .map((p) => p.name)
          .join(", ")}`;
        break;
    }
    if (!notifsGranted) {
      await Notification.requestPermission();
    }
    const { params } = router.currentRoute.value as ChatRoute;
    console.log(params, host, sentMessage.guildId, sentMessage.channelId);
    if (
      params.host == host &&
      params.guild === sentMessage.guildId &&
      params.channel === sentMessage.channelId
    ) {
      return;
    }
    new Notification(title, {
      body: text || "unknown message",
      icon: photo,
      timestamp: +msg.createdAt,
      tag: `${host}-${sentMessage.guildId}-${sentMessage.channelId}`,
    });
  },
  deletedMessage(host, { deletedMessage }) {
    chatState.deleteMessage(
      host,
      deletedMessage.guildId,
      deletedMessage.channelId,
      deletedMessage.messageId
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
