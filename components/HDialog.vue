<template>
  <div>
    <slot name="activator" :toggle="toggle" />
    <transition
      enter-active-class="transition ease-out enter-active"
      enter-class="transform opacity-0"
      enter-to-class="transform opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-class="transform opacity-100"
      leave-to-class="transform opacity-0"
    >
      <div
        v-show="value"
        class="fixed w-full h-full top-0 left-0 z-10 overflow-auto bg-white bg-opacity-10"
      ></div>
    </transition>
    <transition
      enter-active-class="transition ease-out enter-active"
      enter-class="transform scale-0 opacity-0 ease-in-out"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-0"
    >
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
