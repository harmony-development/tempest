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
