<template>
  <div class="sidebar">
    <template v-if="$route.params.guildid && $getHost()">
      <guild-banner :guildname="guildName" />
      <channel-list />
    </template>
  </div>
</template>

<style scoped>
.sidebar {
  flex: 1 0 0;
  overflow-y: auto;
  text-overflow: ellipsis;
  background-color: var(--v-chromeInner-base);
}

.guild-title {
  display: flex;
  align-items: center;
}
</style>

<script lang="ts">
import Vue from 'vue'
import GuildBanner from './GuildBanner/index.vue'
import ChannelList from './ChannelList/index.vue'
export default Vue.extend({
  components: {
    GuildBanner,
    ChannelList,
  },
  computed: {
    guildName(): string | undefined {
      return this.$accessor.app.data[this.$getHost()]?.guilds[
        this.$route.params.guildid
      ]?.name
    },
    selectedGuildID() {
      return this.$route.params.guildid
    },
    channelList() {
      return this.$accessor.app.data[this.$getHost()]?.guilds[
        this.$route.params.guildid
      ]?.channels
    },
  },
})
</script>
