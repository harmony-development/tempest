<template>
  <div class="root">
    <portal-target name="destination" multiple> </portal-target>
    <global-dialog />
    <drawer v-model="leftNav" drawer-class="w-3/4 sm:w-1/2 md:w-80 flex">
      <left-drawer />
    </drawer>
    <div class="h-full flex-1 flex flex-col">
      <app-bar>
        <div>
          <h-btn
            icon
            text
            class="md:hidden"
            @click.native.stop="leftNav = true"
          >
            <h-icon icon="mdiMenu" />
          </h-btn>
        </div>
        <h-icon icon="mdiPound" class="text-gray-400 mr-2" />
        <h1 class="text-lg">{{ channelName }}</h1>
        <spacer />
        <div>
          <h-btn
            icon
            text
            class="md:hidden"
            @click.native.stop="leftNav = true"
          >
            <h-icon icon="mdiAccountMultiple" />
          </h-btn>
        </div>
      </app-bar>
      <chat />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.root {
  @apply w-full h-full flex flex-row overflow-auto;
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Connection } from '@harmony-dev/harmony-web-sdk'
import LeftDrawer from '~/components/LeftDrawer/LeftDrawer.vue'
import 'hint.css/hint.base.min.css'
import '@/assets/fixes.css'
import { IChannelData, IGuildData } from '~/store/app'

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
    guildData(): IGuildData | undefined {
      return this.$guildData()
    },
    channelData(): IChannelData | undefined {
      return this.$channelData()
    },
    guildSettingsOpen(): boolean {
      return this.$accessor.ui.guildSettingsOpen
    },
    channelName(): string | undefined {
      return this.channelData?.channelName
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
