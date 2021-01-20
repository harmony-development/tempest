<template>
  <h-dialog v-model="open">
    <template slot="activator">
      <h-btn
        text
        icon
        class="w-14 h-14 hint--right"
        aria-label="Guild Menu"
        data-balloon-blunt
        @click.native="open = !open"
      >
        <h-icon icon="mdiAccountPlus" />
      </h-btn>
    </template>
    <paper class="p-4 w-1/5">
      <h1 class="text-xl">Hello</h1>
    </paper>
  </h-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      open: false,
    }
  },
})
</script>
