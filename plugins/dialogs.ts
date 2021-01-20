import Vue from 'vue'
import { DialogType } from '~/store/dialog'

declare module 'vue/types/vue' {
  interface Vue {
    $showDialog(type: DialogType, content: string): void
    $confirmDialog(content: string, action: string): Promise<boolean>
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

Vue.prototype.$confirmDialog = function (
  this: Vue,
  content: string,
  action: string
) {
  return new Promise((resolve) =>
    this.$accessor.dialog.openDialog({
      type: DialogType.Confirmation,
      content,
      action,
      res: resolve,
    })
  )
}
