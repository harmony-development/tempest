import {
  Profile,
  UserStatus,
} from "@harmony-dev/harmony-web-sdk/dist/gen/profile/v1/types";

export interface IUserData {
  username?: string;
  avatar?: string;
  status?: UserStatus;
  bot?: boolean;
}

export function toUserDataV1(
  data: {
    id: string;
    profile: Profile;
  }[]
): Record<string, IUserData> {
  return data.reduce<Record<string, IUserData>>((res, { id, profile }) => {
    res[id] = {
      username: profile.userName,
      avatar: profile.userAvatar,
      status: profile.userStatus,
      bot: profile.isBot,
    };
    return res;
  }, {});
}
