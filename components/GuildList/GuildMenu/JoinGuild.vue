<template>
  <v-card flat>
    <v-card-title>Join Guild</v-card-title>
    <v-card-text>
      <v-text-field
        outlined
        label="Invite Link"
        hide-details="auto"
        class="mb-2"
      >
        <template v-slot:append>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on"> mdi-help-circle-outline </v-icon>
            </template>
            Invites look like this: <br />
            asdf72 <br />
            harmony://[domain]/[invite] <br />
            epic-discord
          </v-tooltip>
        </template>
      </v-text-field>
      <div>
        <a @click="$emit('create-guild-clicked')">Create A Guild?</a>
      </div>
      <div class="mt-2">
        <v-btn color="primary">Join Guild</v-btn>
        <v-btn text @click="$emit('cancelled')">Cancel</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>
