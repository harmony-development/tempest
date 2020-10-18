<template>
  <v-select
    v-model="value"
    :items="hosts"
    label="Hosts"
    outlined
    hide-details="auto"
    :value="hosts[0]"
  />
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    hosts(): (string | undefined)[] {
      return [this.$accessor.app.host]
    },
  },
  methods: {},
})
</script>
