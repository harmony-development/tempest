<script setup lang="ts">
import { defineProps, ref, computed } from "vue";
import { useVModel } from "@vueuse/core";
import { FocusTrap } from "focus-trap-vue";
import HInput from "~/components/HInput.vue";
import HBtn from "~/components/shared/HBtn.vue";

import { hostList } from "~/logic/entry";

const props = defineProps<{
  modelValue: boolean;
}>();
const emit = defineEmits(["update:modelValue"]);
const open = useVModel(props, "modelValue", emit);
const name = ref("");
const host = ref("");

const disabled = computed(() => !name.value || !host.value);

const doneClicked = () => {
  hostList.value.push({
    name: name.value,
    host: host.value,
  });
  name.value = "";
  host.value = "";
  open.value = false;
};
</script>

<template>
  <focus-trap :active="open">
    <form @submit.prevent="">
      <h1 v-t="'auth.add-server'" class="text-lg mb-4" />
      <h-input
        v-model="name"
        class="mb-2"
        :label="$t('auth.server-name')"
        :focus="open"
      />
      <h-input
        v-model="host"
        :label="$t('auth.server-address')"
        class="border-surface-500"
      />
      <div class="flex mt-4 justify-end">
        <h-btn
          variant="text"
          color="secondary"
          class="mr-2"
          type="button"
          @click="open = false"
        >
          Cancel
        </h-btn>
        <h-btn
          variant="text"
          color="primary"
          :disabled="disabled"
          type="submit"
          @click="doneClicked"
        >
          Done
        </h-btn>
      </div>
    </form>
  </focus-trap>
</template>
