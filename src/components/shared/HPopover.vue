<script lang="ts" setup>
import Popper from 'vue3-popper';
</script>

<template>
  <Popper v-bind="$attrs">
    <slot />
    <template #content>
      <slot name="content" />
    </template>
  </Popper>
</template>
