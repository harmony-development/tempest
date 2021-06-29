<script lang="ts" setup>
import { computed, defineProps } from "vue";
import { parseHMC } from "~/logics/harmonyAPI";
import { useAppRoute } from "~/logics/location";
import { appState } from "~/store/app";

const route = useAppRoute();
const props = defineProps<{
  userid?: string;
  uri?: string;
  rounded?: boolean;
}>();

const host = computed(() => appState.getHost(route.value.host));

const src = computed(() => {
  if (props.uri) return parseHMC(props.uri, route.value.host);
  if (props.userid) {
    const avatar = host.value.users[props.userid]?.avatar;
    if (!avatar) return;
    return parseHMC(avatar, route.value.host);
  }
});
</script>
<template>
  <div class="bg-gray-500" :class="{ 'rounded-full': props.rounded }">
    <img :src="src" :class="{ 'rounded-full': props.rounded }" />
  </div>
</template>
