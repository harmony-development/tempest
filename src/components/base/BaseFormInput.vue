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
	<base-input v-bind="$attrs" outlined :label="name" @input="handleChange" @blur="handleBlur" :modelValue="value" />
	<p class="text-red-500" v-show="errorMessage">{{ errorMessage }}</p>
</template>
