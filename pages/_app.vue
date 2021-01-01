<template>
  <div class="root">
    <v-navigation-drawer
      v-model="leftNav"
      app
      :permanent="$vuetify.breakpoint.mdAndUp"
      width="350px"
    >
      <div class="left-drawer">
        <guild-list />
        <sidebar />
      </div>
    </v-navigation-drawer>
    <v-main>
      <v-app-bar fixed height="48px">
        <v-app-bar-nav-icon @click="leftNav = !leftNav" />
        <v-spacer />
        <v-btn icon @click="rightNav = !rightNav">
          <v-icon>mdi-account-supervisor</v-icon>
        </v-btn>
      </v-app-bar>
      <chat />
    </v-main>
    <v-navigation-drawer
      v-model="rightNav"
      app
      right
      class="pl-3 pr-3 member-drawer"
      :permanent="$vuetify.breakpoint.mdAndUp"
    >
      <member-list />
    </v-navigation-drawer>
    <user-popover />
    <guild-settings />
    <image-view />
    <user-settings />
    <guild-context-menu />
  </div>
</template>

<style>
div.v-navigation-drawer__border {
  display: none;
}
</style>

<style scoped>
.root {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  overflow: auto;
}

.member-drawer {
  background-color: var(--harmony-background-chrome-inner) !important;
}

.v-app-bar {
  background-color: var(--harmony-background-chrome-inner) !important;
  box-sizing: border-box;
  border-bottom: 1px solid var(--harmony-borders);
}

.left-drawer {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: row;
}
</style>

<script lang="ts">
import Vue from 'vue'
import GuildList from '@/components/GuildList/index.vue'
import Sidebar from '@/components/Sidebar/index.vue'
import MemberList from '@/components/MemberList/index.vue'
import Chat from '@/components/Chat/index.vue'
import { Connection } from '@harmony-dev/harmony-web-sdk'
import GuildSettings from '@/components/GuildSettings/index.vue'
import UserPopover from '~/components/UserPopover.vue'
import ImageView from '~/components/ImageView.vue'
import GuildContextMenu from '~/components/GuildContextMenu.vue'

export default Vue.extend({
  components: {
    GuildList,
    Sidebar,
    MemberList,
    Chat,
    UserPopover,
    GuildSettings,
    ImageView,
    GuildContextMenu,
  },
  data() {
    return {
      leftNav: false,
      rightNav: false,
    }
  },
  watch: {
    '$accessor.app.disconnections': {
      handler() {
        console.log('disconnected')
      },
    },
  },
  created() {
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
  },
  key: 'app',
})
</script>
