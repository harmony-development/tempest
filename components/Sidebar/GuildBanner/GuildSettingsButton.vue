<template>
  <v-tooltip bottom>
    <template #activator="{ on }">
      <v-btn icon v-on="on" @click="click">
        <v-icon size="24px">mdi-cog</v-icon>
      </v-btn>
    </template>
    Guild Settings
  </v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      dialog: false,
      channelType: 'text',
      name: '',
    }
  },
  methods: {
    click() {
      this.$accessor.ui.setGuildSettingsOpen(true)
    },
  },
})
</script>
