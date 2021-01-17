<template>
  <input type="text" class="text-field" />
</template>

<style lang="postcss" scoped>
.text-field {
  @apply border-b-4 border-transparent px-2 py-3 bg-harmonydark-400 bg-opacity-5 outline-none rounded-t shadow-xl transition duration-200;
  &:focus {
    @apply border-primary-400;
  }
}
</style>
