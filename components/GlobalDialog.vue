<template>
  <h-dialog
    :value="dialogState.open"
    @input="this.$accessor.dialog.closeDialog"
  >
    <paper class="p-4 w-1/5">
      <h1 class="text-xl">
        {{ dialogType[dialogState.type] }}
      </h1>
      <p class="text-base">
        {{ dialogState.content }}
      </p>

      <div class="flex mt-4">
        <spacer />
        <h-btn
          visible="isConfirmation"
          text
          color="secondary"
          @click.native="reject"
        >
          {{ rejectText }}
        </h-btn>
        <h-btn text @click.native="confirm">
          {{ confirmText }}
        </h-btn>
      </div>
    </paper>
  </h-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { DialogType } from '@/store/dialog'

export default Vue.extend({
  computed: {
    confirmText(): string {
      return this.$accessor.dialog.dialog.action ?? 'Ok'
    },
    rejectText: () => 'Cancel',
    dialogState(): {
      open: boolean
      type: DialogType
      content: string
      action?: string
      res?: Function
    } {
      return this.$accessor.dialog.dialog
    },
    dialogType(): typeof DialogType {
      return DialogType
    },
    rejectButtonColor(): string {
      return 'primary'
    },
    isConfirmation(): boolean {
      return this.$accessor.dialog.dialog.type === DialogType.Confirmation
    },
  },
  methods: {
    confirm() {
      this.$accessor.dialog.closeDialog()
      if (this.$accessor.dialog.dialog.res !== undefined) {
        console.log('Confirm')
        this.$accessor.dialog.dialog.res(true)
      }
    },
    reject() {
      this.$accessor.dialog.closeDialog()
      if (this.$accessor.dialog.dialog.res !== undefined) {
        console.log('Reject')
        this.$accessor.dialog.dialog.res(false)
      }
    },
  },
})
</script>
