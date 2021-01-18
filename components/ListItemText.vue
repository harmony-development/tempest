<template>
  <div>
    <p
      :class="{
        'text-gray-400': secondary,
      }"
    >
      <slot />
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    secondary: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
