<template>
  <v-sheet class="pl-4 pt-2 pb-2 pr-2 guild-title">
    <h6 class="subtitle-1">{{ guildname }}</h6>
    <v-spacer />
    <guild-settings-button />
    <add-channel-button />
  </v-sheet>
</template>

<style scoped>
.guild-title {
  display: flex;
  align-items: center;
}
</style>

<script lang="ts">
import Vue from 'vue'
import AddChannelButton from './AddChannelButton.vue'
import GuildSettingsButton from './GuildSettingsButton.vue'
export default Vue.extend({
  components: {
    AddChannelButton,
    GuildSettingsButton,
  },
  props: {
    guildname: {
      type: String,
      default: '',
    },
  },
})
</script>
