<template>
  <div>
    <h3 class="mb-4">Login To {{ host }}</h3>
    <v-text-field label="Email" outlined type="email"></v-text-field>
    <v-text-field label="Password" outlined type="password"></v-text-field>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    host() {
      return this.$route.hash.substr(1)
    },
  },
})
</script>
