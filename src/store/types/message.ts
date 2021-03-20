export interface IMessageData {
  author: string;
  createdAt: number;
  editedAt: number;
  content: string;
  pending: boolean;
  override: {
    username?: string;
    avatar?: string;
    reason?: string;
  };
}
