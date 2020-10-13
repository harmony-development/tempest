import { getAccessorType } from 'nuxt-typed-vuex'
import * as entry from './entry'

export const accessorType = getAccessorType({
  modules: { entry },
})
