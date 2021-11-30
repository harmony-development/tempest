<script lang="ts" setup>
import HDialog from "./HDialog.vue";
import HBtn from "./shared/HBtn.vue";
import { promptState } from "~/store/prompt";
</script>

<template>
  <HDialog v-model="promptState.state.promptOpen">
    <div>
      <slot />
      <div class="flex flex-row-reverse">
        <HBtn
          v-t="'button.ok'"
          color="primary"
          variant="text"
          @click="promptState.state.resolve?.()"
        />
      </div>
    </div>
  </HDialog>
</template>
