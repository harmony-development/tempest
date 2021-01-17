import { mutationTree } from 'nuxt-typed-vuex'

interface IState {
  guildSettingsOpen: boolean
  profileSettingsOpen: boolean
}

export const state = (): IState => ({
  guildSettingsOpen: false,
  profileSettingsOpen: false,
})

export const mutations = mutationTree(state, {
  setGuildSettingsOpen(state, data: boolean) {
    state.guildSettingsOpen = data
  },
  setProfileSettingsOpen(state, data: boolean) {
    state.profileSettingsOpen = data
  },
})
