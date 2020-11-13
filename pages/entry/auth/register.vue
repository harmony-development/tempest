<template>
  <fragment>
    <h3 class="mb-4">Register At {{ $getHost() }}</h3>
    <v-text-field
      v-model="email"
      label="Email"
      type="email"
      outlined
      hide-details="auto"
      class="mb-3"
    ></v-text-field>
    <v-text-field
      v-model="username"
      label="Username"
      outlined
      type="username"
      hide-details="auto"
      class="mb-3"
    ></v-text-field>
    <v-text-field
      v-model="password"
      label="Password"
      outlined
      type="password"
      hide-details="auto"
      class="mb-3"
    ></v-text-field>
    <v-text-field
      v-model="confirmPassword"
      label="Confirm Password"
      outlined
      type="password"
      hide-details="auto"
      class="mb-3"
      :rules="[validateConfirmPassword]"
    ></v-text-field>
    <a @click="toLogin">Already have an account?</a>
    <v-btn
      block
      class="mt-2"
      :disabled="
        !email || !username || !password || password !== confirmPassword
      "
      @click="registerClicked"
      >Register</v-btn
    >
  </fragment>
</template>

<script lang="ts">
import { Connection } from '@harmony-dev/harmony-web-sdk'
import Vue from 'vue'
import { DialogType } from '~/store/dialog'

export default Vue.extend({
  data() {
    return {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    }
  },
  methods: {
    toLogin() {
      this.$router.replace({ path: 'login', hash: this.$route.hash })
    },
    validateConfirmPassword() {
      return this.password === this.confirmPassword || 'Passwords do not match'
    },
    async registerClicked() {
      const c = new Connection(this.$getHost())
      try {
        const resp = await c.register(this.email, this.username, this.password)
        this.$accessor.app.setUserID(resp.message?.getUserId())
        this.$accessor.app.setSession(resp.message?.getSessionToken())
        this.$router.push({ path: '/app' })
      } catch (e) {
        this.$accessor.dialog.openDialog({
          type: DialogType.Error,
          content: e.statusMessage,
        })
      }
    },
  },
})
</script>
