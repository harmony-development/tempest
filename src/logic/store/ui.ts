import { Store } from "./store";

export interface IUIState {
  addGuildDialog: boolean;
  addChannelDialog: boolean;
  guildSettingsDialog: boolean;
  userSettingsDialog: boolean;
  confirmDialog: {
    open: boolean;
    title?: string;
    description?: string;
    resolve?: () => void;
    reject?: () => void;
  };
}

class UIState extends Store<IUIState> {
  openConfirm(title: string, description: string) {
    const promise = new Promise<void>((res, rej) => {
      this.state.confirmDialog.resolve = res;
      this.state.confirmDialog.reject = rej;
    });
    this.state.confirmDialog.title = title;
    this.state.confirmDialog.description = description;
    this.state.confirmDialog.open = true;
    return promise;
  }

  rejectDialog() {
    this.state.confirmDialog.reject!();
    this.state.confirmDialog.open = false;
  }

  resolveDialog() {
    this.state.confirmDialog.resolve!();
    this.state.confirmDialog.open = false;
  }
}

export const uiState = new UIState({
  addGuildDialog: false,
  addChannelDialog: false,
  guildSettingsDialog: false,
  userSettingsDialog: false,
  confirmDialog: {
    open: false,
  },
});
