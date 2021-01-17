<template>
  <nav :class="{ appbar: true, absolute }">
    <slot />
  </nav>
</template>

<style scoped lang="postcss">
.appbar {
  @apply w-full bg-gray-700 bg-opacity-25 mx-auto p-3 flex items-center mx-auto;
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    absolute: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
