<template>
  <v-dialog v-model="dialogOpen" max-width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn fab text large color="primary" dark v-bind="attrs" v-on="on">
        <v-icon dark size="24"> mdi-account-multiple-plus </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-tabs fixed-tabs>
        <v-tab>Join Guild</v-tab>
        <v-tab>Create Guild</v-tab>
        <v-tab-item>
          <join-guild-menu />
        </v-tab-item>
        <v-tab-item>
          <v-card flat> </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import JoinGuildMenu from './GuildMenu/JoinGuild.vue'

export default Vue.extend({
  components: {
    JoinGuildMenu,
  },
  data() {
    return {
      dialogOpen: false,
    }
  },
})
</script>
