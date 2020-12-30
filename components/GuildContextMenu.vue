<template>
  <v-menu v-model="open" absolute :position-x="x" :position-y="y">
    <v-list>
      <v-list-item link @click="leaveGuild"> Leave Guild </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  computed: {
    x() {
      return this.$accessor.guildContextMenu.x
    },
    y() {
      return this.$accessor.guildContextMenu.y
    },
    host() {
      return this.$accessor.guildContextMenu.host
    },
    guildID() {
      return this.$accessor.guildContextMenu.guildID
    },
    open: {
      get() {
        return this.$accessor.guildContextMenu.open
      },
      set(v: boolean) {
        this.$accessor.guildContextMenu.setDialogOpen(v)
      },
    },
  },
  methods: {
    async leaveGuild() {
      if (!this.guildID || !this.host) return

      await this.$confirmDialog(
        'Are you sure you would like to leave?',
        'Leave Guild',
      )

      this.$leaveGuild(`https://${this.host}`, this.guildID)
    },
  },
})
</script>
