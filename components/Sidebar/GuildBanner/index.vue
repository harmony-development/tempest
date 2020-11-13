<template>
  <v-sheet class="pl-4 pt-2 pb-2 pr-2 guild-title">
    <h6 class="subtitle-1">{{ guildname }}</h6>
    <v-spacer />
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon size="24px" v-bind="attrs" v-on="on">mdi-cog</v-icon>
        </v-btn>
      </template>
      Guild Settings
    </v-tooltip>
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
export default Vue.extend({
  components: {
    AddChannelButton,
  },
  props: {
    guildname: {
      type: String,
      default: '',
    },
  },
})
</script>
