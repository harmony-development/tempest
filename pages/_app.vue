<template>
  <div class="root">
    <div class="background" />
    <drawer v-model="leftNav">
      <h1>Hello</h1>
    </drawer>
    <div class="h-full">
      <app-bar absolute>
        <h-btn
          icon="globe"
          text
          class="md:invisible"
          @click.native.stop="leftNav = true"
        >
        </h-btn>
        <spacer />
        <h-btn
          icon="globe"
          text
          class="md:invisible"
          @click.native.stop="leftNav = true"
        >
        </h-btn>
      </app-bar>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.root {
  @apply w-full h-full relative flex flex-row overflow-auto;
}

.background {
  @apply absolute w-full h-full top-0 left-0;
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Connection } from '@harmony-dev/harmony-web-sdk'

export default Vue.extend({
  name: 'App',
  components: {},
  data() {
    return {
      leftNav: false,
      rightNav: false,
    }
  },
  computed: {
    guildSettingsOpen() {
      return this.$accessor.ui.guildSettingsOpen
    },
    channelName() {
      return this.$accessor.app.data[this.$getHost()]?.channels[
        this.$route.params.channelid
      ]?.channelName
    },
    guildIconSrc() {
      const picture = this.$accessor.app.data[this.$getHost()]?.guilds[
        this.$route.params.guildid
      ]?.picture
      if (!picture) return undefined
      return `url(${this.$parseMediaURI(this.$getHost(), picture)})`
    },
  },
  watch: {
    '$accessor.app.disconnections': {
      handler() {
        console.log('disconnected')
      },
    },
  },
  async created() {
    if (!this.$accessor.app.host || !this.$accessor.app.session) {
      this.$router.push('entry')
      return
    }
    const conn = new Connection(this.$accessor.app.host)
    conn.session = this.$accessor.app.session
    this.$bindEvents(conn)
    conn.beginStream()
    conn.subscribeToHomeserverEvents()
    this.$accessor.app.setConnection({
      host: this.$accessor.app.host,
      connection: conn,
    })
    await this.$fetchUser(this.$accessor.app.host, this.$accessor.app.userID!)
  },
  key: 'app',
})
</script>
