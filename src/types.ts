import { Stream } from "@harmony-dev/harmony-web-sdk/dist/lib/src/harmonystream";
import authgen from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/auth/v1/output";
import chatgen from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/chat/v1/output";
import { ViteSSGContext } from "vite-ssg";

export type UserModule = (ctx: ViteSSGContext) => void;

export type AuthStream = Stream<
  typeof authgen.protocol.auth.v1.AuthStep,
  typeof authgen.protocol.auth.v1.StreamStepsRequest,
  authgen.protocol.auth.v1.IStreamStepsRequest,
  authgen.protocol.auth.v1.AuthStep
>;

export type ChatStream = Stream<
  typeof chatgen.protocol.chat.v1.Event,
  typeof chatgen.protocol.chat.v1.StreamEventsRequest,
  chatgen.protocol.chat.v1.IStreamEventsRequest,
  chatgen.protocol.chat.v1.Event
>;
