<template>
  <v-list-item>
    <v-list-item-icon>
      <v-icon>mdi-pound</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title v-text="name"></v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  computed: {
    name(): string | undefined {
      console.log(this.$route.hash.substr(1))
      return this.$accessor.app.data[this.$route.hash.substr(1)]?.channels[
        this.id
      ]?.channelName
    },
  },
})
</script>
