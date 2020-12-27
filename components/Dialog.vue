<template>
  <v-dialog
    :value="dialogState.open"
    max-width="290"
    @input="this.$accessor.dialog.closeDialog"
  >
    <v-card>
      <v-card-title class="headline">
        {{ dialogType[dialogState.type] }}
      </v-card-title>
      <v-card-text>
        {{ dialogState.content }}
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          visible="isConfirmation"
          :color="rejectButtonColor"
          text
          @click="reject"
        >
          {{ rejectText }}
        </v-btn>
        <v-btn :color="confirmButtonColor" text @click="confirm">
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { DialogType } from '@/store/dialog'

export default Vue.extend({
  computed: {
    confirmText: () => 'Delete',
    rejectText: () => 'Cancel',
    dialogState() {
      return this.$accessor.dialog.dialog
    },
    dialogType() {
      return DialogType
    },
    confirmButtonColor() {
      switch (this.$accessor.dialog.dialog.type) {
        case DialogType.Error:
        case DialogType.Confirmation: {
          return 'red'
        }
        case DialogType.Info: {
          return 'primary'
        }
        default: {
          return 'primary'
        }
      }
    },
    rejectButtonColor() {
      return 'primary'
    },
    isConfirmation() {
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
