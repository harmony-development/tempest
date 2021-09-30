<script lang="ts" setup>
import { AuthStep_Form } from "@harmony-dev/harmony-web-sdk/dist/gen/auth/v1/auth";
import HInput from "~/components/shared/HInput.vue";
import HBtn from "~/components/shared/HBtn.vue";
import { ref } from "vue";

const props = defineProps<{
  form: AuthStep_Form;
}>();
defineEmits<{
  (event: "done", values: string[]): void;
}>();

const fieldValues = ref<string[]>(props.form.fields.map(() => ""));
</script>

<template>
  <p class="font-bold mb-2">{{ form.title }}</p>
  <form class="flex flex-col gap-3" @submit.prevent="">
    <template v-for="(f, i) in form.fields">
      <h-input
        :label="f.name"
        :type="f.type"
        autocomplete="on"
        v-model="fieldValues[i]"
      />
    </template>
    <h-btn
      variant="outlined"
      class="w-min ml-auto"
      color="primary"
      type="submit"
      @click="$emit('done', fieldValues)"
    >
      Done
    </h-btn>
  </form>
</template>
