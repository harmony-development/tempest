export interface IChannelData {
  name?: string;
  kind?: string;
  messages?: number[];
  unread?: boolean;
  reachedTop?: boolean;
  typing?: {
    [userID: number]: Date;
  };
}
