import { Store } from "./store";
import { IGuildEntry } from "./types/guildList";

interface IGuildListState {
  guildList?: IGuildEntry[];
}

class GuildListState extends Store<IGuildListState> {
  getGuildList() {
    return this.state.guildList;
  }

  setGuildList(list: IGuildEntry[]) {
    this.state.guildList = list;
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

// @ts-ignore
window.guildListState = guildListState;
