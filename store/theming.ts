import { mutationTree } from 'nuxt-typed-vuex'
import colors from 'vuetify/lib/util/colors'

interface IState {
  dark: boolean | undefined
  primary: string | undefined
  secondary: string | undefined
}

export const state = (): IState => ({
  dark: true,
  primary: colors.blue.lighten2,
  secondary: colors.amber.darken3,
})

export const mutations = mutationTree(state, {
  applyTheme(state, data: IState) {
    state.dark = data.dark
    state.primary = data.primary
    state.secondary = data.primary
  },
})
