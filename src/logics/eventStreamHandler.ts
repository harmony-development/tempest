import chatgen from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/chat/v1/output";
import { ChatStream } from "~/types";

export const eventStreamHandler = (stream: ChatStream) => {
  return (ev: chatgen.protocol.chat.v1.Event) => {
    switch (ev.event) {
    }
  };
};

export const closeStreamHandler = (stream: ChatStream) => {
  return (ev: CloseEvent) => {
    console.log("closed", ev);
  };
};

export const openStreamhandler = (stream: ChatStream) => {
  return (ev: Event) => {
    stream.send({});
  };
};
