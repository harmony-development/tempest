<script setup lang="ts">
import { defineProps, defineEmit, ref } from "vue";
import { useVModel } from "@vueuse/core";
import HDialog from "~/components/HDialog.vue";
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

const doneClicked = () => {
  hostList.value.push({
    name: name.value,
    host: host.value,
  });
  open.value = false;
};
</script>

<template>
  <h-dialog v-model="open">
    <h1 v-t="'auth.add-server'" class="text-lg" />
    <h-input v-model="name" class="mb-2" :label="$t('auth.server-name')" />
    <h-input
      v-model="host"
      :label="$t('auth.server-address')"
      class="border-harmonydark-500"
    />
    <div class="flex mt-4 justify-end">
      <h-btn
        variant="text"
        color="secondary"
        class="mr-2"
        @click="open = false"
      >
        Cancel
      </h-btn>
      <h-btn
        variant="text"
        color="primary"
        :disabled="!host || !name"
        @click="doneClicked"
      >
        Done
      </h-btn>
    </div>
  </h-dialog>
</template>
