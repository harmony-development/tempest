import { Store } from "./store";
import { IGuildEntry } from "../types/guilds";
interface IChatState {
  guildList?: IGuildEntry[];
}
class ChatState extends Store<IChatState> {}

export const chatState = new ChatState({});
