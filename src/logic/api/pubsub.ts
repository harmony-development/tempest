import {
  StreamEvent as StreamChatEvent,
  StreamEventsResponse,
} from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/stream";
import { StreamEvent as StreamEmoteEvent } from "@harmony-dev/harmony-web-sdk/dist/gen/emote/v1/stream";
import { StreamEvent as StreamProfileEvent } from "@harmony-dev/harmony-web-sdk/dist/gen/profile/v1/stream";
import { guildListState } from "../../store/guildList";
import { appState } from "../../store/app";

type Defined<T> = Exclude<T, undefined>;

type Oneof = { oneofKind: string | undefined };

type OneofHandler<T extends Oneof> = {
  [key in Defined<T["oneofKind"]>]?: (ev: T & { oneofKind: key }) => any;
};

function handle<T extends Oneof>(handler: OneofHandler<T>, input: T) {
  if (!input.oneofKind) return;
  const h = handler[input.oneofKind as keyof typeof handler];
  // typescript can't take it anymore.
  h?.(input as any);
}

export function pubsub(host: string): (ev: StreamEventsResponse) => void {
  const chatEventHandlers: OneofHandler<StreamChatEvent["event"]> = {
    guildAddedToList({ guildAddedToList: guild }) {
      guildListState.addGuild({
        guildId: guild.guildId,
        host: guild.homeserver,
      });
    },
    guildRemovedFromList({ guildRemovedFromList: guild }) {
      guildListState.removeGuild(guild.homeserver, guild.guildId);
    },
    sentMessage({ sentMessage: msgEvent }) {
      const { message } = msgEvent;
      if (!message) return;
      appState.addMessage(host, msgEvent.channelId, msgEvent.messageId, {
        author: message.authorId,
        createdAt: +(message.createdAt || 0),
        editedAt: +(message.editedAt || 0),
        pending: false,
        override: {},
      });
    },
    deletedMessage({ deletedMessage }) {
      appState.deleteMessage(
        host,
        deletedMessage.channelId,
        deletedMessage.messageId
      );
    },
    editedMessage({ editedMessage }) {
      appState.updateMessage(host, editedMessage.messageId, {
        editedAt: Date.now(),
        content: {
          content: {
            oneofKind: "textMessage",
            textMessage: {
              content: editedMessage.newContent,
            },
          },
        },
      });
    },
  };

  const profileEventHandlers: OneofHandler<StreamProfileEvent["event"]> = {
    profileUpdated({ profileUpdated: event }) {
      appState.updateUser(host, event.userId, {
        username: event.newUsername,
        avatar: event.newAvatar,
        bot: event.newIsBot,
        status: event.newStatus,
      });
    },
  };

  const handlers: OneofHandler<StreamEventsResponse["event"]> = {
    chat({ chat }) {
      handle(chatEventHandlers, chat.event);
    },
    profile({ profile }) {
      handle(profileEventHandlers, profile.event);
    },
  };

  return ({ event }: StreamEventsResponse) => {
    if (!event.oneofKind) return;
    handle(handlers, event);
  };
}
