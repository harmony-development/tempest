import { getAccessorType } from 'typed-vuex'
import * as entry from './entry'
import * as app from './app'
import * as dialog from './dialog'
import * as userPopover from './userPopover'
import * as imageView from './imageView'
import * as guildContextMenu from './guildContextMenu'
import * as ui from './ui'

export const accessorType = getAccessorType({
  modules: {
    entry,
    app,
    dialog,
    userPopover,
    imageView,
    guildContextMenu,
    ui,
  },
})
