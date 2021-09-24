import { ChannelWithId } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/channels";

export interface IChannelData {
  name?: string;
  kind?: string;
  messages?: string[];
  unread?: boolean;
  reachedTop?: boolean;
  typing?: {
    [userID: number]: Date;
  };
}

export function toChannelDataV1(channels: ChannelWithId[]) {
  return channels.reduce<{
    [key: string]: IChannelData;
  }>((data, channelWithID) => {
    const { channel } = channelWithID;
    data[channelWithID.channelId] = {
      name: channel?.channelName,
      kind: channel?.isCategory ? "category" : "text",
    };
    return data;
  }, {});
}

export const toChannelList = (channels: ChannelWithId[]) =>
  channels.map((c) => c.channelId);
