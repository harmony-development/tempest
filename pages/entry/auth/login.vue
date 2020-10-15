<template>
  <fragment>
    <h3 class="mb-4">Login To {{ host }}</h3>
    <v-text-field label="Email" outlined type="email"></v-text-field>
    <v-text-field
      label="Password"
      outlined
      type="password"
      hide-details="auto"
      class="mb-2"
    ></v-text-field>
    <a>New User?</a>
    <v-btn block class="mt-2">Login</v-btn>
  </fragment>
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
