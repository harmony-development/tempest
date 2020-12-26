<template>
  <v-card elevation="2" outlined>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>{{ title }}</v-list-item-title>
        <v-list-item-subtitle>{{ body }}</v-list-item-subtitle>
        <v-card-actions>
          <v-btn v-for="a in actions" :key="a">{{ a }}</v-btn>
        </v-card-actions>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    title: {
      type: String,
      default: '',
    },
    body: {
      type: String,
      default: '',
    },
    actions: {
      type: Array as () => Array<string>,
      default: () => [] as string[],
    },
  },
})
</script>
