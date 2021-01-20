<template>
  <fragment>
    <div v-show="value" class="overlay" @click.self="close"></div>
    <div :class="['drawer', !value ? 'closed' : undefined, drawerClass]">
      <slot />
    </div>
  </fragment>
</template>

<style lang="postcss" scoped>
.overlay {
  @apply fixed w-full h-full top-0 left-0 z-10 overflow-auto bg-gray-500 bg-opacity-10 md:hidden;
}

.drawer {
  @apply h-full bg-harmonydark-700 transform top-0 left-0 fixed overflow-auto ease-in-out transition duration-150 z-30;
}

.closed {
  @apply -translate-x-full md:transform-none;
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  inheritAttrs: false,
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    drawerClass: {
      type: String || Object || Array,
      default: '',
    },
  },
  methods: {
    close() {
      this.setOpen(false)
    },
    setOpen(open: boolean) {
      this.$emit('input', open)
    },
  },
})
</script>
