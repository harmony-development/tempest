import { Event } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/streaming";
import { StreamEventsResponse } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/stream";
import { appState } from "~/store/app";
import { guildListState } from "~/store/guildList";
import { ChatStream } from "~/types";

export const closeStreamHandler = (stream: ChatStream) => {
  return () => {
    console.log("closed");
  };
};
