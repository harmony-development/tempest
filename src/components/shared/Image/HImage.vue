<script lang="ts" setup>
import { computed, defineProps, ref } from "vue";
import { parseHMC } from "~/logic/utils/parsing";
import { useAppRoute } from "~/logic/location";
import { appState } from "~/store/app";

const route = useAppRoute();

const props = defineProps<{
  userid?: string;
  fallback?: string;
  hmcUri?: string;
  uri?: string;
  rounded?: boolean;
  square?: boolean;
  fileName?: boolean;
}>();

const loadError = ref(false);

const host = computed(() => appState.getHost(route.value.host));

const src = computed(() => {
  if (props.uri) return props.uri;
  if (props.hmcUri) return parseHMC(props.hmcUri, route.value.host);
  if (props.userid) {
    const avatar = host.value.users[props.userid]?.avatar;
    if (!avatar) return undefined;
    return parseHMC(avatar, route.value.host);
  }
  return undefined;
});

const fallback = computed(() => {
  if (props.fallback) return props.fallback;
  if (props.userid) {
    return host.value.users[props.userid]?.username || "Unknown";
  }
  return "Unknown";
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
    :class="{ 'rounded-full': rounded, square, user: userid }"
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

.user {
  @apply bg-secondary-900;
}
</style>
