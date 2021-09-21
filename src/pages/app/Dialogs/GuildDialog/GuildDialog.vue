<script lang="ts" setup>
import { useVModel } from "@vueuse/core";
import { defineEmit, defineProps, ref } from "vue";
import JoinScreen from "./JoinScreen.vue";
import CreateScreen from "./CreateScreen.vue";
import HDialog from "~/components/HDialog.vue";

const props = defineProps<{
  modelValue: boolean;
}>();
const emit = defineEmits(["update:modelValue"]);
const open = useVModel(props, "modelValue", emit);
const screen = ref<"create" | "join">("join");
</script>

<template>
  <h-dialog v-model="open">
    <join-screen
      v-if="screen === 'join'"
      v-model:open="open"
      v-model:screen="screen"
    />
    <create-screen
      v-else-if="screen === 'create'"
      v-model:open="open"
      v-model:screen="screen"
    />
  </h-dialog>
</template>
