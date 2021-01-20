<template>
  <nav :class="{ appbar: true, absolute }">
    <slot />
  </nav>
</template>

<style scoped lang="postcss">
.appbar {
  @apply w-full bg-harmonydark-600 mx-auto p-3 flex items-center h-14;
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
