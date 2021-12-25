<script setup lang="ts">
import OutlinedInput from "../shared/Inputs/OutlinedInput.vue";
import PlainInput from "../shared/Inputs/PlainInput.vue";
defineProps<{
	plain?: boolean;
	outlined?: boolean;
}>();
</script>
<template>
	<plain-input v-bind="$attrs" v-if="plain" />
	<outlined-input v-bind="$attrs" v-else />
</template>
