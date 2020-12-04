<template>
  <v-container class="root fill-height" fluid>
    <v-row class="flex-grow-0">
      <h1>Roles and Permissions</h1>
    </v-row>
    <v-row>
      <v-col cols="3">
        <v-list dense nav class="list-root">
          <v-list-item v-for="r in rolesList || []" :key="r">
            <v-list-item-icon>
              <div class="role-color red" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Sample Role 1</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col> </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.list-root {
  background-color: var(--harmony-dark-600);
  height: 100%;
}
.role-color {
  border-radius: 100%;
  width: 100%;
  height: 100%;
}

.container.fill-height {
  flex-direction: column;
  align-items: initial;
}

.container.fill-height > .row {
  flex: 1 1 auto;
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  computed: {
    rolesList() {
      return this.$accessor.app.data[this.$getHost()]?.guilds[
        this.$route.params.guildid
      ]?.roles
    },
  },
  async mounted() {
    await this.$fetchGuildRoles(this.$getHost(), this.$route.params.guildid)
  },
})
</script>
