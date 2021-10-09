<script lang="ts" setup>
import { onMounted, computed } from "vue";
import { connectionManager } from "../../../logic/api/connections";
import { chatState } from "../../../logic/store/chat";

const props = defineProps<{
  active?: boolean;
  host: string;
  guildid: string;
}>();

const data = computed(() => chatState.getGuild(props.host, props.guildid));
</script>

<template>
  <div v-wave class="icon" :class="{ active }" style="aspect-ratio: 1">
    <HImg
      :src="data.owner"
      class="object-contain pointer-events-none"
      draggable="false"
      :fallback="data.name?.[0]"
    />
  </div>
</template>

<style lang="postcss" scoped>
.icon {
  @apply w-full
      bg-surface-500
      rounded-full
      cursor-pointer
      overflow-hidden
      flex-shrink-0
      select-none
      border-primary-300
      transition transition-all
      duration-100
      border-0;
  &:active {
    @apply border-4 bg-surface-600;
  }
}

.active {
  @apply border-2;
}
</style>
