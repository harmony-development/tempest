import { Channel } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/channels";
import { IChannel, IChannelData } from "../store/chat";

export const convertChannelV1 = (channel: Channel): Partial<IChannelData> => ({
  name: channel?.channelName,
  kind: channel?.kind,
});
