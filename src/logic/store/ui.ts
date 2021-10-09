import { Store } from "./store";

export interface IUIState {
  addGuildDialog: boolean;
  addChannelDialog: boolean;
  guildSettingsDialog: boolean;
}

class UIState extends Store<IUIState> {}

export const uiState = new UIState({
  addGuildDialog: false,
  addChannelDialog: false,
  guildSettingsDialog: false,
});
