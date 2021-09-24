import { MaybeRef } from "@vueuse/core";
import { getOrFederate } from "../connections";
import { appState } from "../../store/app";
import { toChannelDataV1, toChannelList } from "../../store/types/channel";
import { toUserDataV1 } from "../../store/types/user";
import { guildListState } from "~/store/guildList";

export function useGuildList(host: MaybeRef<string>) {
  return asyncComputed(async () => {
    if (!guildListState.state.guildList) {
      const conn = await getOrFederate(unref(host));
      const { response } = await conn.chat.getGuildList({});
      guildListState.setGuildList(
        response.guilds.map((guild) => ({
          guildId: guild.guildId,
          host: guild.serverId || unref(host),
        }))
      );
    }
    return guildListState.state.guildList;
  });
}

export function useChannelList(
  hostRef: MaybeRef<string>,
  guildIDRef: MaybeRef<string>
) {
  return asyncComputed(async () => {
    const host = unref(hostRef);
    const guildID = unref(guildIDRef);

    if (!appState.getGuild(host, guildID).channels) {
      const conn = await getOrFederate(unref(host));
      const { response } = await conn.chat.getGuildChannels({
        guildId: guildID,
      });
      appState.setChannelData(host, toChannelDataV1(response.channels));
      appState.setGuildChannels(
        host,
        guildID,
        toChannelList(response.channels)
      );
    }
    return appState.getGuild(host, guildID).channels;
  });
}

export function useMemberList(
  hostRef: MaybeRef<string>,
  guildIDRef: MaybeRef<string>
) {
  return asyncComputed(async () => {
    const host = unref(hostRef);
    const guildID = unref(guildIDRef);
    const conn = await getOrFederate(unref(host));
    const { response } = await conn.chat.getGuildMembers({
      guildId: guildID,
    });

    // TODO: move to bulk requests
    const memberProfiles = toUserDataV1(
      await Promise.all(
        response.members.map(async (id) => ({
          id,
          profile: (
            await conn.profile.getProfile({ userId: id }).response
          ).profile!,
        }))
      )
    );
    appState.setUserData(host, memberProfiles);
    appState.setGuildMembers(host, guildID, response.members);

    return appState.getGuild(host, guildID).members;
  });
}
