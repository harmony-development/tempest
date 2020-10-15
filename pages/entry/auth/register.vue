<template>
  <fragment>
    <h3 class="mb-4">Register At {{ host }}</h3>
    <v-text-field
      label="Email"
      type="email"
      outlined
      hide-details="auto"
      class="mb-3"
    ></v-text-field>
    <v-text-field
      label="Username"
      outlined
      type="username"
      hide-details="auto"
      class="mb-3"
    ></v-text-field>
    <v-text-field
      label="Password"
      outlined
      type="password"
      hide-details="auto"
      class="mb-3"
    ></v-text-field>
    <a @click="toLogin">Already have an account?</a>
    <v-btn block class="mt-2">Register</v-btn>
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
  methods: {
    toLogin() {
      this.$router.replace({ path: 'login', hash: this.$route.hash })
    },
  },
})
</script>
