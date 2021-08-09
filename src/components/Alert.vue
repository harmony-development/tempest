<script lang="ts" setup>
import { computed } from "vue";
import HDialog from "./HDialog.vue";
import HBtn from "./shared/HBtn.vue";
import { promptState } from "~/store/prompt";

const open = computed(() => promptState.state.promptOpen);
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
          @click="promptState.resolve()"
        />
      </div>
    </div>
  </HDialog>
</template>
