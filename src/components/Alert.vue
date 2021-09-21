<script lang="ts" setup>
import HDialog from "./HDialog.vue";
import HBtn from "./shared/HBtn.vue";
import { usePromptState } from "~/store/prompt";

const promptState = usePromptState();
</script>

<template>
  <HDialog v-model="promptState.open">
    <div>
      <slot />
      <div class="flex flex-row-reverse">
        <HBtn
          v-t="'button.ok'"
          color="primary"
          variant="text"
          @click="promptState.resolve()"
        />
      </div>
    </div>
  </HDialog>
</template>
