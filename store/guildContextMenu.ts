import { mutationTree } from 'typed-vuex'

interface IState {
  open: boolean
  host: string | undefined
  guildID: string | undefined
  x: number
  y: number
}

export const state = (): IState => ({
  open: false,
  host: undefined,
  guildID: undefined,
  x: 0,
  y: 0,
})

export const mutations = mutationTree(state, {
  openDialog(
    state,
    data: {
      guildID: string
      host: string
      x: number
      y: number
    }
  ) {
    state.open = true
    state.guildID = data.guildID
    state.host = data.host
    state.x = data.x
    state.y = data.y
  },
  setDialogOpen(state, value: boolean) {
    state.open = value
  },
})
