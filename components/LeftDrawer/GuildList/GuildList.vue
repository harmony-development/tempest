<template>
  <div class="guild-list">
    <guild-icon
      v-for="guild in guildList"
      :id="guild.guildId"
      :key="`${guild.guildId}:${guild.host}`"
      :host="guild.host || $accessor.app.host"
    />
  </div>
</template>

<style lang="postcss" scoped>
.guild-list {
  scrollbar-width: none;
  @apply bg-harmonydark-800 p-3 w-auto overflow-y-auto;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  computed: {
    guildList() {
      return this.$accessor.app.guildsList || []
    },
  },
  async mounted() {
    try {
      const conn = this.$homeserverConn()
      const resp = (await conn.getGuildList()).message?.toObject()
      this.$accessor.app.setGuildList(resp!.guildsList)
    } catch (e) {
      if (e.statusMessage === 'invalid-session') {
        this.$accessor.app.setSession() // todo: make sure localstorage is cleared correctly
        Object.values(this.$accessor.app.connections).forEach((conn) =>
          conn.client?.close()
        )
        this.$router.push('/')
        this.$toast.info('Session Expired, please login again', {
          duration: 3000,
        })
      } else {
        this.$toast.error('Error', {
          duration: 2000,
        })
      }
    }
  },
})
</script>
