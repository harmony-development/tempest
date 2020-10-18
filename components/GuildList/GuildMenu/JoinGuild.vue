<template>
  <v-card flat>
    <v-card-title>Join Guild</v-card-title>
    <v-card-text>
      <host-list v-model="host" class="mb-2" />
      <v-text-field
        v-model="joinCode"
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
            epic-discord
          </v-tooltip>
        </template>
      </v-text-field>
      <div>
        <a @click="$emit('create-guild-clicked')">Create A Guild?</a>
      </div>
      <div class="mt-2">
        <v-btn color="primary" :disabled="!host || !joinCode">Join Guild</v-btn>
        <v-btn text @click="$emit('cancelled')">Cancel</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import HostList from './HostList.vue'

export default Vue.extend({
  components: {
    HostList,
  },
  data() {
    return {
      host: undefined,
      joinCode: undefined,
    }
  },
})
</script>
