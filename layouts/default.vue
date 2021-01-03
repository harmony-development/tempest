<template>
  <v-app dark>
    <Nuxt />
    <Dialog />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Dialog from '@/components/Dialog.vue'

export default Vue.extend({
  name: 'Default',
  components: { Dialog },
  async mounted() {
    await this.$nextTick()
    const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    if (this.$accessor.theming.dark === undefined) {
      this.$vuetify.theme.dark = darkMediaQuery.matches
    } else {
      this.$vuetify.theme.currentTheme.primary = this.$accessor.theming.primary
      this.$vuetify.theme.currentTheme.secondary = this.$accessor.theming.secondary
      this.$vuetify.theme.dark = this.$accessor.theming.dark
    }
  },
})
</script>
