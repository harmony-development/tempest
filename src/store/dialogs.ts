import { Store } from "./store";

interface IDialogsState {
  userSettingsOpen: boolean;
}

class DialogsState extends Store<IDialogsState> {
  toggleUserSettingsDialog() {
    this.state.userSettingsOpen = !this.state.userSettingsOpen;
  }
}

export const dialogState = new DialogsState({
  userSettingsOpen: false,
});
