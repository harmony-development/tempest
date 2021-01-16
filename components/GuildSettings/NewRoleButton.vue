<template>
  <v-dialog v-model="open" max-width="340">
    <template v-slot:activator="{ on, attrs }">
      <v-btn outlined color="primary" v-bind="attrs" v-on="on">New Role</v-btn>
    </template>
    <v-card>
      <v-card-title class="headline"> Create New Role </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="name"
          outlined
          label="Role Name"
          hide-details="auto"
        />
        <color-picker-input v-model="color" class="mt-4" />
        <v-checkbox v-model="pingable" label="Pingable" hide-details="auto" />
        <v-checkbox
          v-model="hoist"
          label="Display separate from member list"
          hide-details="auto"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="open = false"> Cancel </v-btn>
        <v-btn
          color="primary"
          text
          :disabled="!name || !color"
          @click="createClicked"
        >
          Create
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
      open: false,
      name: '' as string,
      color: '#ffffff',
      pingable: false,
      hoist: false,
    }
  },
  methods: {
    async createClicked() {
      const r = parseInt(this.color.slice(1, 3), 16)
      const g = parseInt(this.color.slice(3, 5), 16)
      const b = parseInt(this.color.slice(5, 7), 16)
      const argb =
        ((255 & 0xff) << 24) |
        ((r & 0xff) << 16) |
        ((g & 0xff) << 8) |
        (b & 0xff)
      await this.$createRole(
        this.$getHost(),
        this.$route.params.guildid,
        this.name,
        argb,
        this.hoist,
        this.pingable,
      )
      this.open = false
    },
  },
})
</script>
