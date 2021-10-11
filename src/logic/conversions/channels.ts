import { Channel } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/channels";
import { IChannel } from "../store/chat";

export const convertChannelV1 = (channel: Channel): Partial<IChannel> => ({
  name: channel?.channelName,
  kind: channel?.kind,
});
