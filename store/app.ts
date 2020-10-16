import { mutationTree } from 'nuxt-typed-vuex'

interface IState {
  userID: string | undefined
  session: string | undefined
}

export const state = (): IState => ({
  userID: undefined,
  session: undefined,
})

export const mutations = mutationTree(state, {
  setUserID(state, userID?: string) {
    state.userID = userID
  },
  setSession(state, token?: string) {
    state.session = token
  },
})
