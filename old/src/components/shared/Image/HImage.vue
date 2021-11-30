<script lang="ts" setup>
import { computed, defineProps, ref } from "vue";
import { parseHMC } from "~/logic/utils/parsing";
import { useAppRoute } from "~/logic/location";

const route = useAppRoute();

const props = defineProps<{
  fallback?: string;
  hmcSrc?: string;
  src?: string;
  rounded?: boolean;
  square?: boolean;
  fileName?: boolean;
}>();

const loadError = ref(false);

const src = computed(() => {
  if (props.src) return props.src;
  if (props.hmcSrc) return parseHMC(props.hmcSrc, route.value.host);
  return undefined;
});

const fallback = computed(() => {
  return props.fallback || "U";
});
</script>
<template>
  <div
    class="
      flex
      justify-center
      items-center
      overflow-hidden
      text-center
      select-none
    "
    :class="{ 'rounded-full': rounded, square }"
  >
    <p v-if="loadError || !src" class="text-sm">{{ fallback?.[0] }}</p>
    <img
      v-show="!loadError"
      :src="src"
      :class="{ 'rounded-full': props.rounded }"
      loading="lazy"
      @error="loadError = true"
    />
  </div>
</template>

<style lang="postcss" scoped>
.square {
  aspect-ratio: 1;
}
</style>
