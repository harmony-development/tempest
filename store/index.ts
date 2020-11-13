import { getAccessorType } from 'nuxt-typed-vuex'
import createPersistedState from 'vuex-persistedstate'
import * as entry from './entry'
import * as app from './app'
import * as dialog from './dialog'

export const accessorType = getAccessorType({
  modules: { entry, app, dialog },
})

export const plugins = [
  createPersistedState({
    key: 'staccato',
    paths: ['entry.serverList', 'app.userID', 'app.session', 'app.host'],
  }),
]
