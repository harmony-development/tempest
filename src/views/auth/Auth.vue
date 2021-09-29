<script lang="ts" setup>
import ServerSelect from "./ServerSelect.vue";
</script>

<template>
  <div
    class="
      background
      h-full
      w-full
      overflow-x-auto
      flex flex-col
      justify-center
    "
  >
    <div
      class="flex flex-col gap-2 bg-surface-900 p-3 w-11/12 sm:m-12 md:w-150"
    >
      <ServerSelect />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.background {
  background: repeating-linear-gradient(
    45deg,
    rgba(127, 127, 127, 0.05),
    rgba(127, 127, 127, 0.05) 10px,
    transparent 10px,
    transparent 20px
  );
  background-repeat: repeat;
  fill: black;
}
</style>
