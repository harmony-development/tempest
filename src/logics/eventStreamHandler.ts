import { Event } from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/chat/v1/streaming";
import { appState } from "~/store/app";
import { ChatStream } from "~/types";

export const eventStreamHandler = (host: string, stream: ChatStream) => {
  console.log("h");
  return (ev: Event) => {
    console.log("HI");
    switch (ev.event.oneofKind) {
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
      }
    }
  };
};

export const closeStreamHandler = (stream: ChatStream) => {
  return () => {
    console.log("closed");
  };
};
