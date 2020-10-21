import { mutationTree } from 'nuxt-typed-vuex'

export enum DialogType {
  Error,
  Info,
}

interface IState {
  dialog: {
    open: boolean
    type: DialogType
    content: string
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
  openDialog(state, data: { type: DialogType; content: string }) {
    state.dialog.open = true
    state.dialog.type = data.type
    state.dialog.content = data.content
  },
  closeDialog(state) {
    state.dialog.open = false
  },
})
