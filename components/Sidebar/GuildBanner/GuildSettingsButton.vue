<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <template v-slot:activator="{ on: dialogOn, attrs }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn icon v-on="{ ...tooltip, ...dialogOn }">
            <v-icon size="24px" v-bind="attrs">mdi-cog</v-icon>
          </v-btn>
        </template>
        Guild Settings
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title class="headline"> Guild Settings </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="name"
          label="Name"
          outlined
          hide-details="auto"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false"> Cancel </v-btn>
        <v-btn color="primary " text :disabled="!name" @click="onCreate">
          Save and Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
    onCreate() {
      this.$createChannel(
        this.$getHost(),
        this.$route.params.guildid,
        this.name,
      )
      this.dialog = false
    },
  },
})
</script>
