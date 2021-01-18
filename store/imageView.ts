import { mutationTree } from 'typed-vuex'

interface IState {
  open: boolean
  imageID: string | undefined
}

export const state = (): IState => ({
  open: false,
  imageID: undefined,
})

export const mutations = mutationTree(state, {
  openDialog(state, data: string) {
    state.open = true
    state.imageID = data
  },
  closeDialog(state) {
    state.open = false
  },
})
