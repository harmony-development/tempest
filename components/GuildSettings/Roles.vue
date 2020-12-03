<template>
  <div class="fill-height root">
    <v-row class="mb-2">
      <h1>Roles and Permissions</h1>
    </v-row>
    <v-row>
      <v-col cols="3">
        <v-card>
          <v-list dense nav>
            <v-list-item
              :class="{ 'sidebar-item': true, active: page === 'overview' }"
              @click="page = 'overview'"
            >
              <v-list-item-icon>
                <div class="role-color red" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Sample Role 1</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col> </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.role-color {
  border-radius: 100%;
  width: 100%;
  height: 100%;
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>
