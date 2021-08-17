import { Event } from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/chat/v1/streaming";
import { appState } from "~/store/app";
import { guildListState } from "~/store/guildList";
import { ChatStream } from "~/types";

export const eventStreamHandler = (host: string, stream: ChatStream) => {
  return (ev: Event) => {
    switch (ev.event.oneofKind) {
      case "guildAddedToList": {
        const guild = ev.event.guildAddedToList;
        if (guild) {
          guildListState.addGuild({
            guildId: guild.guildId,
            host: guild.homeserver,
          });
        }
        break;
      }
      case "guildRemovedFromList": {
        guildListState.removeGuild(
          ev.event.guildRemovedFromList.homeserver,
          ev.event.guildRemovedFromList.guildId
        );
        break;
      }
      case "sentMessage": {
        const msg = ev.event.sentMessage.message;
        if (msg) {
          appState.addMessage(host, msg.channelId, msg.messageId, {
            author: msg.authorId,
            createdAt: Number(msg.createdAt?.seconds),
            editedAt: Number(msg.editedAt?.seconds),
            content: msg.content,
            pending: false,
            override: {
              reason: msg.overrides?.reason.oneofKind,
              avatar: msg.overrides?.avatar,
              username: msg.overrides?.name,
            },
          });
        }
        break;
      }
      case "deletedMessage": {
        appState.deleteMessage(
          host,
          ev.event.deletedMessage.channelId,
          ev.event.deletedMessage.messageId
        );
        break;
      }
      case "editedMessage": {
        const edited = ev.event.editedMessage;
        appState.updateMessage(host, edited.messageId, {
          ...(edited.updateContent && { content: edited.content }),
          ...(edited.updateAttachments && { attachments: edited.attachments }),
          ...(edited.overrides && {
            override: {
              username: edited.overrides.name,
              reason: edited.overrides.reason.oneofKind,
              avatar: edited.overrides.avatar,
            },
          }),
          editedAt: +edited.editedAt!.seconds,
        });
        break;
      }
      case "profileUpdated": {
        const event = ev.event.profileUpdated;
        appState.updateUser(host, event.userId, {
          ...(event.updateUsername && { username: event.newUsername }),
          ...(event.updateAvatar && { avatar: event.newAvatar }),
          ...(event.updateIsBot && { bot: event.isBot }),
          ...(event.updateStatus && { status: event.newStatus }),
        });
        break;
      }
    }
  };
};

export const closeStreamHandler = (stream: ChatStream) => {
  return () => {
    console.log("closed");
  };
};
