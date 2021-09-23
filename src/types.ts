import { ViteSSGContext } from "vite-ssg";
import {
  DuplexStreamingCall,
  ServerStreamingCall,
} from "@protobuf-ts/runtime-rpc";
import {
  StreamStepsRequest,
  StreamStepsResponse,
} from "@harmony-dev/harmony-web-sdk/dist/gen/auth/v1/auth";
import { StreamEventsRequest } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/streaming";
import { StreamEventsResponse } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/stream";

export type UserModule = (ctx: ViteSSGContext) => void;

export type AuthStream = ServerStreamingCall<
  StreamStepsRequest,
  StreamStepsResponse
>;

export type ChatStream = DuplexStreamingCall<
  StreamEventsRequest,
  StreamEventsResponse
>;
