<template>
  <popover v-model="open" :x="x" :y="y">
    <list>
      <list-item> Copy ID </list-item>
    </list>
  </popover>
</template>

<script lang="ts">
import Vue from 'vue'
import { uiState } from '~/store/ui'
export default Vue.extend({
  computed: {
    open: {
      get() {
        return uiState.state.messageDropdownOpen
      },
      set(v: boolean) {
        uiState.setMessageDropdownOpen(v)
      },
    },
    x() {
      return 0
    },
    y() {
      return 0
    },
  },
})
</script>
