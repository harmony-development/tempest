import type { Channel } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/channels";
import type { IChannelData } from "../store/chat";

export const convertChannelV1 = (channel: Channel): IChannelData => ({
	name: channel.channelName,
	kind: channel.kind,
});
