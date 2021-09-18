import { UserStatus } from "@harmony-dev/harmony-web-sdk/dist/gen/harmonytypes/v1/types";

export interface IUserData {
  username?: string;
  avatar?: string;
  status?: UserStatus;
  bot?: boolean;
}
