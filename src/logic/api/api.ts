import { MaybeRef } from "@vueuse/core";
import { getOrFederate } from "../connections";
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
