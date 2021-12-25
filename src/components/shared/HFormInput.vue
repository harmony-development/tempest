<script lang="ts" setup>
import { useField } from "vee-validate";
import HInput from "~/components/shared/HInput.vue";

const props = defineProps<{
	name: string;
	value?: string;
}>();

const { value, errorMessage, handleBlur, handleChange } = useField(props.name, undefined, {
	initialValue: props.value,
});
</script>
<template>
	<HInput v-bind="$attrs" outlined :label="name" @input="handleChange" @blur="handleBlur" :modelValue="value"></HInput>
	<p class="text-red-500" v-show="errorMessage">{{ errorMessage }}</p>
</template>
