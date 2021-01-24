import Vue from 'vue'
import { dialogState, DialogType } from '~/store/dialog'

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
  dialogState.openDialog(type, content)
}

Vue.prototype.$confirmDialog = function (
  this: Vue,
  content: string,
  action: string
) {
  return new Promise((resolve) =>
    dialogState.openDialog(DialogType.Confirmation, content, action, resolve)
  )
}
