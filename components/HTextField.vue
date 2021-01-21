<template>
  <textarea v-if="multiline" class="text-field" rows="1"></textarea>
  <input v-else v-model="inputVal" type="text" class="text-field" />
</template>

<style lang="postcss" scoped>
.text-field {
  @apply border-2 border-transparent px-2 py-3 bg-harmonydark-400 bg-opacity-5 outline-none rounded-t shadow-md transition duration-200;
  &:focus {
    @apply border-2 border-primary-400;
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: {
      type: String,
      default: '',
    },
    multiline: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    inputVal: {
      get(): string {
        return this.value
      },
      set(val: string): void {
        this.$emit('input', val)
      },
    },
  },
})
</script>
