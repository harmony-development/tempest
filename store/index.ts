import { getAccessorType } from 'nuxt-typed-vuex'
import createPersistedState from 'vuex-persistedstate'
import * as entry from './entry'
import * as app from './app'
import * as dialog from './dialog'
import * as userPopover from './userPopover'

export const accessorType = getAccessorType({
  modules: { entry, app, dialog, userPopover },
})

export const plugins = [
  createPersistedState({
    key: 'staccato',
    paths: ['entry.serverList', 'app.userID', 'app.session', 'app.host'],
  }),
]
