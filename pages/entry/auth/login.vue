<template>
  <form @submit.prevent="loginClicked">
    <h3 class="mb-4">Login To {{ $getHost() }}</h3>
    <v-text-field
      v-model="email"
      label="Email"
      outlined
      type="email"
      hide-details="auto"
      class="mb-3"
      autocomplete="email"
      name="email"
    ></v-text-field>
    <v-text-field
      v-model="password"
      label="Password"
      outlined
      hide-details="auto"
      class="mb-2"
      type="password"
      autocomplete="current-password"
    ></v-text-field>
    <a @click="toRegister">New user?</a>
    <div class="d-flex justify-end">
      <v-btn class="mt-2 mr-2" color="primary" text @click="toServerSelect">
        Back
      </v-btn>
      <v-btn
        class="mt-2"
        :disabled="!email || !password"
        type="submit"
        color="primary"
      >
        Login
      </v-btn>
    </div>
  </form>
</template>

<script lang="ts">
import Vue from 'vue'
import { Connection } from '@harmony-dev/harmony-web-sdk'
import { DialogType } from '~/store/dialog'

export default Vue.extend({
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    toRegister() {
      this.$router.push({ path: 'register', hash: this.$route.hash })
    },
    toServerSelect() {
      this.$router.push('/entry/serverselect')
    },
    async loginClicked() {
      const c = new Connection(this.$getHost())
      this.$bindEvents(c)
      c.beginStream()
      try {
        const resp = await c.loginLocal(this.email, this.password)
        this.$accessor.app.setUserID(resp.message?.getUserId())
        this.$accessor.app.setSession(resp.message?.getSessionToken())
        this.$accessor.app.setHost(this.$getHost())
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
