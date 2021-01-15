<template>
  <div class="guild-list">
    <template v-if="guildList">
      <guild-icon
        v-for="entry in guildList"
        :id="entry.guildId"
        :key="`${entry.guildId}:${entry.host}`"
        :host="entry.host || $accessor.app.host"
      />
    </template>
    <guild-menu-button />
  </div>
</template>

<style scoped>
.guild-list {
  padding: 8px;
  display: flex;
  flex-direction: column;
  background-color: var(--v-chromeOuter-base);
  box-sizing: border-box;
}
</style>

<script lang="ts">
import Vue from 'vue'
import GuildMenuButton from './GuildMenuButton.vue'
import GuildIcon from './GuildIcon.vue'
import { DialogType } from '~/store/dialog'

export default Vue.extend({
  components: {
    GuildMenuButton,
    GuildIcon,
  },
  computed: {
    guildList() {
      return this.$accessor.app.guildsList
    },
  },
  async created() {
    try {
      const conn = await this.$getOrFederate(this.$accessor.app.host!)
      const resp = await conn.getGuildList()
      const asObj = resp.message?.toObject()

      this.$accessor.app.setGuildList(asObj!.guildsList)
    } catch (e) {
      if (e.statusMessage === 'invalid-session') {
        this.$accessor.app.setSession() // todo: make sure localstorage is cleared correctly
        Object.values(this.$accessor.app.connections).forEach((conn) =>
          conn.client?.close(),
        )
        this.$router.push('/')
      } else {
        this.$showDialog(DialogType.Error, e.statusMessage || e)
      }
    }
  },
})
</script>
