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
  <img
    v-show="!loadError"
    width="32"
    height="32"
    :src="src"
    :class="{ 'rounded-full': props.rounded }"
    loading="lazy"
    @error="loadError = true"
  />
  <div v-if="loadError || !src" class="grid items-center fallback">
    <span class="text-center align-middle">
      {{ fallback?.[0] }}
    </span>
  </div>
</template>

<style lang="postcss" scoped>
.square {
  aspect-ratio: 1;
}
.fallback {
  width: 32px;
  height: 32px;
  background-color: #3daee9;
  border-radius: 16px;
}
img, .fallback {
  margin: 0rem 0.5rem;
}
</style>
