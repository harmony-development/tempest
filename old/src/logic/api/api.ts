import { Ref } from "vue";
import { getOrFederate, getStream } from "../connections";
import { appState } from "../../store/app";
import { toChannelDataV1, toChannelList } from "../../store/types/channel";
import { toUserDataV1 } from "../../store/types/user";
import { IGuildEntry } from "../../store/types/guildList";
import { subscribeToGuild } from "./pubsub";
import { guildListState } from "~/store/guildList";
import { FromV1 } from "~/store/types/guildList";

export async function getGuilds(host: string) {
  const conn = await getOrFederate(unref(host));
  const { guilds } = await conn.chat.getGuildList({}).response;
  return guilds.map((g) => FromV1(g, host));
}

export function useGuildList(host: Ref<string>): {
  guildList: Ref<IGuildEntry[] | undefined>;
  error: Ref<unknown>;
} {
  const error = ref<unknown>();
  watchEffect(async () => {
    try {
      error.value = undefined;
      const guilds = await getGuilds(unref(host));
      guildListState.state.guildList = guilds;
      guilds.forEach(async (g) => {
        const stream = await getStream(g.host || unref(host));
        subscribeToGuild(stream, g.guildId);
      });
    } catch (e) {
      error.value = e;
    }
  });

  return {
    guildList: computed(() => guildListState.state.guildList),
    error,
  };
}

export function useChannelList(
  host: Ref<string>,
  guildID: Ref<string>,
  error: Ref<unknown>
) {
  watchEffect(async () => {
    try {
      if (appState.getGuild(host.value, guildID.value).channels) return;
      const conn = await getOrFederate(host.value);
      const { response } = await conn.chat.getGuildChannels({
        guildId: guildID.value,
      });
      appState.setChannelData(host.value, toChannelDataV1(response.channels));
      appState.setGuildChannels(
        host.value,
        guildID.value,
        toChannelList(response.channels)
      );
    } catch (e) {
      error.value = e;
    }
  });

  return computed(() => appState.getGuild(host.value, guildID.value).channels);
}

export function useMemberList(hostRef: Ref<string>, guildIDRef: Ref<string>) {
  watchEffect(async () => {
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
  });
  return computed(
    () => appState.getGuild(hostRef.value, guildIDRef.value).members
  );
}
