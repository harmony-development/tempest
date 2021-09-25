import {
  StreamEvent as StreamChatEvent,
  StreamEventsResponse,
} from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/stream";
import { StreamEvent as StreamProfileEvent } from "@harmony-dev/harmony-web-sdk/dist/gen/profile/v1/stream";
import { guildListState } from "../../store/guildList";
import { appState } from "../../store/app";
import { Handler } from "./oneof";
import { ChatStream } from "~/types";

const chatEventHandlers = new Handler<StreamChatEvent["event"]>({
  guildAddedToList(_, { guildAddedToList: guild }) {
    guildListState.addGuild({
      guildId: guild.guildId,
      host: guild.homeserver,
    });
  },
  guildRemovedFromList(_, { guildRemovedFromList: guild }) {
    guildListState.removeGuild(guild.homeserver, guild.guildId);
  },
  createdChannel(host, { createdChannel }) {
    appState.addChannel(
      host,
      createdChannel.guildId,
      createdChannel.channelId,
      {
        name: createdChannel.name,
      }
    );
  },
  sentMessage(host, { sentMessage: msgEvent }) {
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
  deletedMessage(host, { deletedMessage }) {
    appState.deleteMessage(
      host,
      deletedMessage.channelId,
      deletedMessage.messageId
    );
  },
  editedMessage(host, { editedMessage }) {
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
});

export const profileEventHandlers = new Handler<StreamProfileEvent["event"]>({
  profileUpdated(host, { profileUpdated: event }) {
    appState.updateUser(host, event.userId, {
      username: event.newUsername,
      avatar: event.newAvatar,
      bot: event.newIsBot,
      status: event.newStatus,
    });
  },
});

export const streamEventsHandler = new Handler<StreamEventsResponse["event"]>({
  chat(host, { chat }) {
    chatEventHandlers.handle(host, chat.event);
  },
  profile(host, { profile }) {
    profileEventHandlers.handle(host, profile.event);
  },
});

export function pubsub(host: string): (ev: StreamEventsResponse) => void {
  return ({ event }: StreamEventsResponse) => {
    streamEventsHandler.handle(host, event);
  };
}

export function subscribeToGuild(stream: ChatStream, guildID: string) {
  return stream.request.send({
    request: {
      oneofKind: "subscribeToGuild",
      subscribeToGuild: {
        guildId: guildID,
      },
    },
  });
}
