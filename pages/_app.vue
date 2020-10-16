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
import ChannelList from '@/components/ChannelList.vue'
import MemberList from '@/components/MemberList.vue'
import Chat from '@/components/Chat.vue'

export default Vue.extend({
  components: {
    GuildList,
    ChannelList,
    MemberList,
    Chat,
  },
})
</script>
