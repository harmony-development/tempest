<template>
  <div class="root">
    <guild-list />
    <channel-list />
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
import ChannelList from '@/components/ChannelList/index.vue'
import MemberList from '@/components/MemberList.vue'
import Chat from '@/components/Chat.vue'
import { Connection } from '@harmony-dev/harmony-web-sdk'

export default Vue.extend({
  components: {
    GuildList,
    ChannelList,
    MemberList,
    Chat,
  },
  created() {
    if (!this.$accessor.app.host || !this.$accessor.app.session) {
      this.$router.push('entry')
      return
    }
    const conn = new Connection(this.$accessor.app.host)
    this.$accessor.app.setConnection({
      host: this.$accessor.app.host,
      connection: conn,
    })
    conn.session = this.$accessor.app.session
  },
})
</script>
