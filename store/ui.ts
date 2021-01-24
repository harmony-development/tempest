import { Store } from './store'

interface IState {
  guildSettingsOpen: boolean
  profileSettingsOpen: boolean
  messageDropdownOpen: boolean
}

class UIState extends Store<IState> {
  setMessageDropdownOpen(v: boolean) {
    this.state.messageDropdownOpen = v
  }
}

export const uiState = new UIState({
  guildSettingsOpen: false,
  profileSettingsOpen: false,
  messageDropdownOpen: false,
})
