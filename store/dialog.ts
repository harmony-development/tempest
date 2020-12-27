import { mutationTree } from 'nuxt-typed-vuex'

export enum DialogType {
  Error,
  Info,
  Confirmation,
}

interface IState {
  dialog: {
    open: boolean
    type: DialogType
    content: string
    action?: string
    res?: Function
  }
}

export const state = (): IState => ({
  dialog: {
    open: false,
    type: DialogType.Info,
    content: '',
  },
})

export const mutations = mutationTree(state, {
  openDialog(
    state,
    data: {
      type: DialogType
      content: string
      action?: string
      res?: Function
    },
  ) {
    state.dialog.open = true
    state.dialog.type = data.type
    state.dialog.content = data.content
    state.dialog.action = data.action
    state.dialog.res = data.res
  },
  closeDialog(state) {
    state.dialog.open = false
  },
})
