<template>
  <fragment>
    <h3 class="mb-4">Login To {{ host }}</h3>
    <v-text-field
      v-model="email"
      label="Email"
      outlined
      type="email"
      hide-details="auto"
      class="mb-3"
    ></v-text-field>
    <v-text-field
      v-model="password"
      label="Password"
      outlined
      type="password"
      hide-details="auto"
      class="mb-2"
    ></v-text-field>
    <a @click="toRegister">New user?</a>
    <v-btn
      block
      class="mt-2"
      :disabled="!email || !password"
      @click="loginClicked"
      >Login</v-btn
    >
  </fragment>
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
  computed: {
    host() {
      return this.$route.hash.substr(1)
    },
  },
  methods: {
    toRegister() {
      this.$router.push({ path: 'register', hash: this.$route.hash })
    },
    async loginClicked() {
      const c = new Connection(this.host)
      try {
        const resp = await c.loginLocal(this.email, this.password)
        this.$accessor.app.setUserID(resp.message?.getUserId())
        this.$accessor.app.setSession(resp.message?.getSessionToken())
        this.$accessor.app.setHost(this.host)
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
