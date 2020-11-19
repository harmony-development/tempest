<template>
  <div class="root">
    <guild-list />
    <sidebar />
    <chat />
    <member-list />
  </div>
</template>

<style scoped>
.root {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  overflow: auto;
}
</style>

<script lang="ts">
import Vue from 'vue'
import GuildList from '@/components/GuildList/index.vue'
import Sidebar from '@/components/Sidebar/index.vue'
import MemberList from '@/components/MemberList.vue'
import Chat from '@/components/Chat/index.vue'
import { Connection } from '@harmony-dev/harmony-web-sdk'

export default Vue.extend({
  components: {
    GuildList,
    Sidebar,
    MemberList,
    Chat,
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
    this.$accessor.app.setConnection({
      host: this.$accessor.app.host,
      connection: conn,
    })
  },
  key: 'app',
})
</script>
