<template>
  <v-dialog v-model="dialogOpen" max-width="500">
    <template #activator="{ on: dialogOn, attrs: dialogAttrs }">
      <v-tooltip right>
        <template #activator="{ on: tooltipOn }">
          <v-btn
            fab
            text
            large
            color="primary"
            dark
            v-bind="dialogAttrs"
            v-on="{ ...dialogOn, ...tooltipOn }"
          >
            <v-icon dark size="24"> mdi-account-multiple-plus </v-icon>
          </v-btn>
        </template>
        Join/Create Guild
      </v-tooltip>
    </template>
    <join-guild-menu
      v-if="joinGuildScreen"
      @cancelled="dialogOpen = false"
      @create-guild-clicked="joinGuildScreen = false"
    />
    <create-guild-menu
      v-if="!joinGuildScreen"
      @cancelled="dialogOpen = false"
      @join-guild-clicked="joinGuildScreen = true"
    />
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import JoinGuildMenu from './GuildMenu/JoinGuild.vue'
import CreateGuildMenu from './GuildMenu/CreateGuild.vue'

export default Vue.extend({
  components: {
    JoinGuildMenu,
    CreateGuildMenu,
  },
  data() {
    return {
      dialogOpen: false,
      joinGuildScreen: true,
    }
  },
})
</script>
