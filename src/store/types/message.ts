import { Content } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";

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
