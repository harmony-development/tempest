import { getAccessorType } from 'nuxt-typed-vuex'
import * as entry from './entry'
import * as app from './app'

export const accessorType = getAccessorType({
  modules: { entry, app },
})
