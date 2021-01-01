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
  mounted() {
    const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    this.$vuetify.theme.dark = darkMediaQuery.matches
  },
})
</script>
