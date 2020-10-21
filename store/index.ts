import { getAccessorType } from 'nuxt-typed-vuex'
import * as entry from './entry'
import * as app from './app'
import * as dialog from './dialog'

export const accessorType = getAccessorType({
  modules: { entry, app, dialog },
})
