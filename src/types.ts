import { ViteSSGContext } from "vite-ssg";
import {
  DuplexStreamingCall,
  ServerStreamingCall,
} from "@protobuf-ts/runtime-rpc";
import {
  AuthStep,
  StreamStepsRequest,
} from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/auth/v1/auth";
import {
  Event,
  StreamEventsRequest,
} from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/chat/v1/streaming";

export type UserModule = (ctx: ViteSSGContext) => void;

export type AuthStream = ServerStreamingCall<StreamStepsRequest, AuthStep>;

export type ChatStream = DuplexStreamingCall<StreamEventsRequest, Event>;
