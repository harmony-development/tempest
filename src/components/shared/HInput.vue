<script setup lang="ts">
import PlainInput from './Inputs/PlainInput.vue';
const props = defineProps<{
  plain?: boolean
  outlined?: boolean
}>()
</script>
<template>
  <PlainInput v-bind="$attrs" v-if="plain" />
  <OutlinedInput v-bind="$attrs" v-else />
</template>
