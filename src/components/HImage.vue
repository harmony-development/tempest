<script lang="ts" setup>
import { computed, defineProps, ref } from "vue";
import { parseHMC } from "~/logics/utils/parsing";
import { useAppRoute } from "~/logics/location";
import { appState } from "~/store/app";

const route = useAppRoute();

const props = defineProps<{
  userid?: string;
  fallback?: string;
  hmcURI?: string;
  uri?: string;
  rounded?: boolean;
}>();

const loadError = ref(false);

const host = computed(() => appState.getHost(route.value.host));

const src = computed(() => {
  if (props.uri) return props.uri;
  if (props.hmcURI) return parseHMC(props.hmcURI, route.value.host);
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
    style="aspect-ratio: 1"
    class="bg-gray-500 flex items-center justify-center overflow-hidden"
    :class="{ 'rounded-full': rounded }"
  >
    <img
      v-show="!loadError"
      :src="src"
      :class="{ 'rounded-full': props.rounded }"
      @error="loadError = true"
    />
    <p v-if="loadError || !src" class="text-xl">{{ fallback?.[0] }}</p>
  </div>
</template>
