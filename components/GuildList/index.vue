<template>
  <div class="guild-list">
    <guild-icon
      v-for="entry in guildList"
      :key="`${entry.guildId}:${entry.host}`"
      :name="entry.guildId"
      :icon="entry.host"
    />
    <guild-menu-button />
  </div>
</template>

<style scoped>
.guild-list {
  padding: 8px;
  display: flex;
  flex-direction: column;
  background-color: var(--harmony-dark-800);
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
      this.$showDialog(DialogType.Error, e.statusMessage || e)
    }
  },
})
</script>
