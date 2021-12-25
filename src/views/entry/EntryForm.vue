<script lang="ts" setup>
import type { AuthStep_Form } from "@harmony-dev/harmony-web-sdk/dist/gen/auth/v1/auth";
import { ref } from "vue";
import BaseButton from "~/components/base/BaseButton.vue";
import BaseInput from "~/components/base/BaseInput.vue";
const props = defineProps<{
	form: AuthStep_Form
	error: unknown
	isLoading: boolean
}>();
defineEmits<{
	(event: "done", values: string[]): void
}>();
const fieldValues = ref<string[]>(props.form.fields.map(() => ""));
</script>

<template>
  <p class="font-bold mb-3">
    {{ form.title }}
  </p>
  <span class="text-error">{{ props.error }}</span>
  <form class="flexcol gap-3" @submit.prevent>
    <template v-for="(f, i) in form.fields" :key="f.name">
      <base-input v-model="fieldValues[i]" :label="f.name" :type="f.type" autocomplete="on" />
    </template>
    <base-button
      variant="outlined"
      class="w-min ml-auto"
      color="primary"
      type="submit"
      :is-loading="isLoading"
      @click="$emit('done', fieldValues)"
    >
      Done
    </base-button>
  </form>
</template>
