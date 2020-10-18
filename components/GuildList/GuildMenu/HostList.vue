<template>
  <v-select
    v-model="value"
    :items="hosts"
    label="Hosts"
    outlined
    hide-details="auto"
    @change="onChange"
  />
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      value: 0,
    }
  },
  computed: {
    hosts(): (string | undefined)[] {
      return [this.$accessor.app.host]
    },
  },
  methods: {
    onChange() {
      this.$emit('input', this.value)
    },
  },
})
</script>
