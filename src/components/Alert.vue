<script lang="ts" setup>
import { useVModel } from "@vueuse/core";
import { defineEmit, defineProps } from "vue";
import HDialog from "./HDialog.vue";
import HBtn from "./HBtn.vue";
const props = defineProps<{
  modelValue: boolean;
}>();
const emit = defineEmit(["update:modelValue"]);
const open = useVModel(props, "modelValue", emit);
</script>

<template>
  <HDialog v-model="open" compact>
    <div>
      <slot />
      <div class="flex flex-row-reverse">
        <HBtn
          v-t="'button.ok'"
          color="primary"
          variant="text"
          @click="open = false"
        />
      </div>
    </div>
  </HDialog>
</template>
