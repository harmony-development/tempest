<template>
  <v-app dark>
    <Nuxt keep-alive />
    <Dialog />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Dialog from '@/components/Dialog.vue'

export default Vue.extend({
  components: { Dialog },
})
</script>
