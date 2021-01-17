<template>
  <div>
    <slot name="activator" :toggle="toggle" />
    <transition
      enter-active-class="transition ease-out"
      enter-class="transform opacity-0"
      enter-to-class="transform opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-class="transform opacity-100"
      leave-to-class="transform opacity-0"
    >
      <div
        v-if="open"
        class="fixed w-full h-full top-0 left-0 z-50 overflow-auto items-center align-center justify-center bg-white bg-opacity-10 flex"
        @click="toggle"
      >
        <div>
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      open: true,
    }
  },
  methods: {
    toggle() {
      this.open = !this.open
    },
  },
})
</script>
