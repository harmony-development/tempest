<script lang="ts" setup>
import { AuthStep_Form } from "@harmony-dev/harmony-web-sdk/dist/gen/auth/v1/auth";
import { ref } from "vue";
import BaseButton from "~/components/base/BaseButton.vue";
import BaseInput from "~/components/base/BaseInput.vue";
const props = defineProps<{
	form: AuthStep_Form;
	error: unknown;
}>();
defineEmits<{
	(event: "done", values: string[]): void;
}>();

const fieldValues = ref<string[]>(props.form.fields.map(() => ""));
</script>

<template>
	<p class="font-bold">{{ form.title }}</p>
	<span class="text-error">{{ props.error }}</span>
	<form class="flexcol gap-3" @submit.prevent>
		<template v-for="(f, i) in form.fields">
			<base-input :label="f.name" :type="f.type" autocomplete="on" v-model="fieldValues[i]" />
		</template>
		<base-button variant="outlined" class="w-min ml-auto" color="primary" type="submit" @click="$emit('done', fieldValues)"
			>Done</base-button
		>
	</form>
</template>
