import Vue from 'vue'
import { DialogType } from '~/store/dialog'

declare module 'vue/types/vue' {
  interface Vue {
    $showDialog(type: DialogType, content: string): void
  }
}

Vue.prototype.$showDialog = function (
  this: Vue,
  type: DialogType,
  content: string
) {
  this.$accessor.dialog.openDialog({
    type,
    content,
  })
}
