<template>
  <div class="guild-list">
    <guild-icon
      v-for="guild in guildsList"
      :id="guild.guildId"
      :key="`${guild.guildId}:${guild.host}`"
      :host="guild.host || defaultHost"
    />
    <guild-btn />
  </div>
</template>

<style lang="postcss" scoped>
.guild-list {
  scrollbar-width: none;
  @apply bg-harmonydark-800 p-3 w-auto overflow-visible;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
import GuildBtn from './GuildBtn.vue'
import { appState } from '~/store/app'
export default Vue.extend({
  components: {
    GuildBtn,
  },
  computed: {
    guildsList() {
      return appState.state.guildsList || []
    },
    defaultHost() {
      return appState.state.host
    },
  },
  async mounted() {
    try {
      const conn = this.$homeserverConn()
      const resp = (await conn.getGuildList()).message?.toObject()
      appState.state.guildsList = resp!.guildsList
    } catch (e) {
      if (e.statusMessage === 'invalid-session') {
        appState.state.session = undefined
        Object.values(appState.state.connections).forEach((conn) =>
          conn.client?.close()
        )
        this.$router.push('/')
      }
    }
  },
})
</script>
