import { Store } from "./store";

interface IDialogsState {
  userSettingsOpen: boolean;
  guildSettingsOpen: boolean;
}

class DialogsState extends Store<IDialogsState> {
  toggleUserSettingsDialog() {
    this.state.userSettingsOpen = !this.state.userSettingsOpen;
  }

  toggleGuildSettingsOpen() {
    this.state.guildSettingsOpen = !this.state.guildSettingsOpen;
  }
}

export const dialogState = new DialogsState({
  userSettingsOpen: false,
  guildSettingsOpen: false,
});
