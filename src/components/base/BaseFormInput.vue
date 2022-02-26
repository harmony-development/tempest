<script lang="ts" setup>
import { useField } from "vee-validate";
import BaseInput from "./BaseInput.vue";

const props = defineProps<{
	name: string;
	value?: string;
}>();

const { value, errorMessage, handleBlur, handleChange } = useField(props.name, undefined, {
	initialValue: props.value,
});
</script>
<template>
	<base-input v-bind="$attrs" outlined :label="name" :model-value="value" @input="handleChange" @blur="handleBlur" />
	<p v-show="errorMessage" class="text-red-500">
		{{ errorMessage }}
	</p>
</template>
