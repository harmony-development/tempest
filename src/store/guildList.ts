import { defineStore } from "pinia";
import { Store } from "./store";
import { IGuildEntry } from "./types/guildList";

export const useGuildListState = defineStore("guild list", {
  state: () => ({
    guilds: [] as IGuildEntry[],
  }),
  actions: {
    setGuildList(list: IGuildEntry[]) {
      this.guilds = list.map((guild) => ({
        guildId: guild.guildId,
        host: new URL(guild.host).origin,
      }));
    },
    addGuild(guild: IGuildEntry) {
      this.guilds.push(guild);
    },
    removeGuild(host: string, guildId: string) {
      this.guilds = this.guilds.filter(
        (guild) => guild.guildId !== guildId || guild.host !== host
      );
    },
  },
});
