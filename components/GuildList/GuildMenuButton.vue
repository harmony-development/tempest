<template>
  <v-dialog v-model="dialogOpen" max-width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn fab text large color="primary" dark v-bind="attrs" v-on="on">
        <v-icon dark size="24"> mdi-account-multiple-plus </v-icon>
      </v-btn>
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
