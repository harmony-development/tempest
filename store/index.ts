import { getAccessorType } from 'nuxt-typed-vuex'
import createPersistedState from 'vuex-persistedstate'
import * as entry from './entry'
import * as app from './app'
import * as dialog from './dialog'
import * as userPopover from './userPopover'
import * as imageView from './imageView'
import * as guildContextMenu from './guildContextMenu'

export const accessorType = getAccessorType({
  modules: { entry, app, dialog, userPopover, imageView, guildContextMenu },
})

export const plugins = [
  createPersistedState({
    key: 'tempest',
    paths: [
      'entry.serverList',
      'app.userID',
      'app.session',
      'app.host',
      'app.personas',
    ],
  }),
]
