<template>
  <h-dialog :value="dialogState.open" @input="reject">
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
import { dialogState, DialogType } from '@/store/dialog'
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  computed: {
    confirmText() {
      return dialogState.state.action ?? 'Ok'
    },
    rejectText: () => 'Cancel',
    dialogType(): typeof DialogType {
      return DialogType
    },
    rejectButtonColor() {
      return 'primary'
    },
    isConfirmation() {
      return dialogState.state.type === DialogType.Confirmation
    },
    dialogState() {
      return dialogState.state
    },
  },
  methods: {
    confirm() {
      dialogState.state.open = false
      if (dialogState.state.res !== undefined) {
        dialogState.state.res(true)
      }
    },
    reject() {
      dialogState.state.open = false
      if (dialogState.state.res !== undefined) {
        dialogState.state.res(false)
      }
    },
  },
})
</script>
