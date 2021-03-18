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
}

export const guildListState = new GuildListState({});

// @ts-ignore
window.guildListState = guildListState;
