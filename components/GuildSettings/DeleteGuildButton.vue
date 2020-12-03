<template>
  <v-dialog v-model="dialogOpen" max-width="290">
    <template v-slot:activator="{ on, attrs }">
      <v-list-item class="sidebar-item dangerous" v-bind="attrs" v-on="on">
        <v-list-item-icon>
          <v-icon>mdi-delete</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Delete Guild</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-card>
      <v-card-title class="headline"> Are you sure? </v-card-title>
      <v-card-text>
        <v-sheet color="error" rounded elevation="4" class="pa-3">
          You are about to delete {{ guildName }}. This cannot be undone.
        </v-sheet>
        <v-text-field
          v-model="specifiedGuildName"
          label="Enter guild name"
          outlined
          class="mt-4"
          hide-details="auto"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          @click="
            dialogOpen = false
            specifiedGuildName = ''
          "
        >
          Cancel
        </v-btn>
        <v-btn
          color="error"
          :disabled="specifiedGuildName !== guildName"
          @click="deleteGuildClicked"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.active {
  background-color: var(--v-accent-base);
  border-left: 4px solid var(--v-primary-base);
}

.sidebar-item {
  transition: 0.1s ease-in;
}

.sidebar {
  border-right: 1px solid var(--v-accent-base);
}

.dangerous {
  background-color: var(--v-error-base);
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      dialogOpen: false,
      specifiedGuildName: '',
    }
  },
  computed: {
    guildName() {
      return this.$accessor.app.data[this.$getHost()]?.guilds[
        this.$route.params.guildid
      ]?.name
    },
  },
  methods: {
    deleteGuildClicked() {},
  },
})
</script>
