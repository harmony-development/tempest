<script setup lang="ts">
import OutlinedInput from "../shared/Inputs/OutlinedInput.vue";
import PlainInput from "../shared/Inputs/PlainInput.vue";
defineProps<{
	plain?: boolean
	outlined?: boolean
}>();
</script>
<template>
  <plain-input v-if="plain" v-bind="$attrs" />
  <outlined-input v-else v-bind="$attrs" />
</template>
