<template>
  <div class="overlay">
    <div v-on-clickaway="close" :class="{ drawer: true, closed: !value }">
      <slot />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.drawer {
  @apply translate-x-0 h-full bg-harmonydark-700 transform top-0 left-0 fixed overflow-auto ease-in-out transition duration-150 z-30;
}

.overlay {
  @apply fixed w-full h-full top-0 left-0 z-10 overflow-auto bg-gray-500 bg-opacity-10;
}

.closed {
  @apply -translate-x-full;
}

@screen md {
  .drawer {
    @apply static translate-x-0;
  }

  .overlay {
    @apply hidden;
  }
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
    close() {
      this.setOpen(false)
    },
    setOpen(open: boolean) {
      this.$emit('input', open)
    },
  },
})
</script>
