<template>
  <div class="root">
    <div
      :class="{ background: true, light: !$vuetify.theme.dark }"
      :style="{ backgroundImage: guildIconSrc }"
    ></div>
    <v-navigation-drawer
      v-model="leftNav"
      app
      :permanent="$vuetify.breakpoint.mdAndUp"
      width="350px"
      :style="{
        backgroundColor: $vuetify.breakpoint.mdAndUp
          ? 'transparent'
          : 'var(--v-harmony-darken1)',
      }"
    >
      <div class="left-drawer">
        <guild-list />
        <sidebar />
      </div>
    </v-navigation-drawer>
    <v-main>
      <v-app-bar flat height="48px" app>
        <v-app-bar-nav-icon
          v-if="!$vuetify.breakpoint.mdAndUp"
          @click="leftNav = !leftNav"
        />
        <v-icon size="18">mdi-pound</v-icon>
        <v-toolbar-title>
          {{ channelName }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn
          v-if="!$vuetify.breakpoint.mdAndUp"
          icon
          @click="rightNav = !rightNav"
        >
          <v-icon>mdi-account-supervisor</v-icon>
        </v-btn>
      </v-app-bar>
      <chat />
    </v-main>
    <v-navigation-drawer
      v-model="rightNav"
      app
      right
      class="member-drawer pl-3"
      :style="{
        backgroundColor: $vuetify.breakpoint.mdAndUp
          ? 'transparent'
          : 'var(--v-harmony-darken1)',
      }"
      :permanent="$vuetify.breakpoint.mdAndUp"
    >
      <member-list />
    </v-navigation-drawer>
    <user-popover />
    <LazyGuildSettings v-if="guildSettingsOpen" />
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
  position: relative;
  display: flex;
  flex-direction: row;
  overflow: auto;
}

.background {
  transition: all 0.3s ease-out;
  position: absolute;
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  top: 0;
  left: 0;
  filter: blur(300px) brightness(50%);
}

.light {
  filter: blur(300px) brightness(200%);
}

.member-drawer:before {
  position: absolute;
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background: var(--v-layer-base);
  opacity: 0.08;
  top: 0;
  left: 0;
}

.v-app-bar {
  box-sizing: border-box;
  border-bottom: 1px solid var(--harmony-borders);
  background-color: transparent !important;
}

.v-app-bar:before {
  position: absolute;
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background: var(--v-layer-base);
  opacity: 0.08;
  top: 0;
  left: 0;
  z-index: -1;
}

.left-drawer {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: row;
}

.left-drawer:before {
  position: absolute;
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background: var(--v-layer-base);
  opacity: 0.08;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>

<script lang="ts">
import Vue from 'vue'
import GuildList from '@/components/GuildList/index.vue'
import Sidebar from '@/components/Sidebar/index.vue'
import MemberList from '@/components/MemberList/index.vue'
import Chat from '@/components/Chat/index.vue'
import { Connection } from '@harmony-dev/harmony-web-sdk'
import UserPopover from '~/components/UserPopover.vue'
import ImageView from '~/components/ImageView.vue'
import GuildContextMenu from '~/components/GuildContextMenu.vue'

export default Vue.extend({
  name: 'App',
  components: {
    GuildList,
    Sidebar,
    MemberList,
    Chat,
    UserPopover,
    ImageView,
    GuildContextMenu,
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
