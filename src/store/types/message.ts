import { Content } from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/harmonytypes/v1/types";

export interface IMessageData {
  author: string;
  createdAt: number;
  editedAt: number;
  content?: Content;
  pending: boolean;
  override: {
    username?: string;
    avatar?: string;
    reason?: string;
  };
}
