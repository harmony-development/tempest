<template>
  <div class="root">
    <div class="background" />
    <drawer v-model="leftNav" drawer-class="w-3/4 sm:w-1/2 md:w-80 flex">
      <left-drawer />
    </drawer>
    <div class="h-full">
      <app-bar absolute>
        <div>
          <h-btn
            icon
            text
            class="md:invisible"
            @click.native.stop="leftNav = true"
          >
            <h-icon icon="mdiMenu" />
          </h-btn>
        </div>
        <spacer />
        <div>
          <h-btn
            icon
            text
            class="md:invisible"
            @click.native.stop="leftNav = true"
          >
            <h-icon icon="mdiAccountMultiple" />
          </h-btn>
        </div>
      </app-bar>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.root {
  @apply w-full h-full flex flex-row overflow-auto;
}

.background {
  @apply absolute w-full h-full top-0 left-0;
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Connection } from '@harmony-dev/harmony-web-sdk'
import LeftDrawer from '~/components/LeftDrawer/LeftDrawer.vue'
import 'balloon-css'
import '@/assets/fixes.css'

export default Vue.extend({
  name: 'App',
  components: {
    LeftDrawer,
  },
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
