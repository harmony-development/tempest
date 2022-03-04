<template>
	<base-input v-model="input1" type="password" label="Password" />
	<base-input v-model="input2" type="password" label="Confirm Password" />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import BaseInput from "../base/BaseInput.vue";

defineProps<{
	modelValue: string;
}>();
const emits = defineEmits(["update:modelValue"]);

const input1 = ref("");
const input2 = ref("");

watch([input1, input2], () => {
	if (input1.value === input2.value) emits("update:modelValue", input1.value);
	else emits("update:modelValue", "");
});
</script>
