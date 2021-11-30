<template>
  <transition name="pop-in">
    <slot />
  </transition>
</template>

<style lang="postcss" scoped>
.pop-in-enter-active,
.pop-in-leave-active {
  @apply transform;
  transition: opacity 0.05s linear, transform 0.05s linear;
}

.pop-in-enter-from,
.pop-in-leave-to {
  @apply opacity-0 -translate-y-2;
}
</style>
