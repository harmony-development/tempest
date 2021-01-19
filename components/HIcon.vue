<template>
  <svg
    viewBox="0 0 24 24"
    class="inline-block fill-current stroke-0"
    :height="size"
    :width="size"
  >
    <path :d="$iconSet[icon]"></path>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    icon: {
      type: String,
      default: '',
    },
    size: {
      type: [String, Number],
      default: 24,
    },
  },
})
</script>
