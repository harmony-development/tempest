import { Event } from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/chat/v1/streaming";
import { ChatStream } from "~/types";

export const eventStreamHandler = (stream: ChatStream) => {
  return (ev: Event) => {
    switch (ev.event) {
    }
  };
};

export const closeStreamHandler = (stream: ChatStream) => {
  return () => {
    console.log("closed");
  };
};
