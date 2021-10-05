<script lang="ts" setup>
import GuildIcon from "./GuildIcon.vue";
</script>

<template>
  <div class="list">
    <div
      class="
        w-18
        p-2
        flex flex-col
        gap-2
        h-full
        overflow-y-scroll
        no-scrollbar
        z-1
        relative
        bg-surface-900
      "
    >
      <GuildIcon v-for="_ in 20" />
    </div>
    <button class="add-menu-pop" v-wave>
      <mdi-plus />
    </button>
  </div>
</template>

<style lang="postcss" scoped>
.list {
  @apply h-full overflow-visible relative w-min;

  &:hover > .add-menu-pop {
    @apply left-full visible;
  }
}

.add-menu-pop {
  @apply absolute
        text-xl
        bg-primary-600
        rounded-r-xl
        top-1/2
        left-0
        flex
        py-9
        z-0
        transition transition-all duration-100
        invisible;
}
</style>
