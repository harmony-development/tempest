import { Store } from './store'

export enum DialogType {
  Error,
  Info,
  Confirmation,
}

interface IState {
  open: boolean
  type: DialogType
  content: string
  action?: string
  res?: Function
}

class DialogState extends Store<IState> {
  openDialog(
    type: DialogType,
    content: string,
    action?: string,
    res?: Function
  ) {
    this.state.open = true
    this.state.type = type
    this.state.content = content
    this.state.action = action
    this.state.res = res
  }
}

export const dialogState = new DialogState({
  open: false,
  type: DialogType.Info,
  content: '',
  action: undefined as string | undefined,
  res: undefined as Function | undefined,
})
