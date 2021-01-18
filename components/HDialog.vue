<template>
  <div>
    <slot name="activator" :toggle="toggle" />
    <transition name="overlay">
      <div
        v-show="value"
        class="fixed w-full h-full top-0 left-0 z-10 overflow-auto bg-white bg-opacity-10"
      ></div>
    </transition>
    <transition name="content">
      <div
        v-show="value"
        class="fixed z-50 top-0 left-0 w-full h-full flex items-center align-center justify-center"
        @click.self="toggle"
      >
        <slot />
      </div>
    </transition>
  </div>
</template>

<style lang="postcss" scoped>
.overlay-enter-active,
.overlay-leave-active {
  @apply transition ease-in duration-150;
}

.overlay-enter-to,
.overlay-leave {
  @apply transform opacity-100;
}

.overlay-enter,
.overlay-leave-to {
  @apply transform opacity-0;
}

.content-enter-active,
.content-leave-active {
  @apply transition ease-in duration-150;
}

.content-enter-to,
.content-leave {
  @apply transform scale-100 opacity-100;
}

.content-enter,
.content-leave-to {
  @apply transform scale-0 opacity-0 ease-in-out;
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggle() {
      this.$emit('input', !this.value)
    },
  },
})
</script>
