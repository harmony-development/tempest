<template>
  <v-dialog
    v-model="dialogState.open"
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
          :color="dialogButtonColor"
          text
          @click="this.$accessor.dialog.closeDialog"
        >
          Ok
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
    dialogState() {
      return this.$accessor.dialog.dialog
    },
    dialogType() {
      return DialogType
    },
    dialogButtonColor() {
      switch (this.$accessor.dialog.dialog.type) {
        case DialogType.Error: {
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
  },
})
</script>
