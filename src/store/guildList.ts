import { Store } from "./store";
import { IGuildEntry } from "./types/guildList";

class GuildListState extends Store<{
  guildList?: IGuildEntry[];
}> {
  getGuildList() {
    return this.state.guildList;
  }

  setGuildList(list: IGuildEntry[]) {
    this.state.guildList = list.map((it) => ({
      guildId: it.guildId,
      host: new URL(it.host).origin,
    }));
  }

  addGuild(entry: IGuildEntry) {
    this.state.guildList?.push(entry);
  }

  removeGuild(host: string, id: string) {
    this.state.guildList = this.state.guildList?.filter(
      (v) => v.guildId !== id || v.host !== host
    );
  }
}

export const guildListState = new GuildListState({});

// @ts-ignorew
window.guildListState = guildListState;
