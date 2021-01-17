<template>
  <app-bar />
</template>

<script lang="ts">
import Vue from 'vue'
import AppBar from '~/components/AppBar.vue'
export default Vue.extend({
  components: { AppBar },
  methods: {
    toggleTheme() {
      this.$colorMode.preference =
        this.$colorMode.preference === 'light' ? 'dark' : 'light'
    },
  },
})
</script>
