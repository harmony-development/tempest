<script lang="ts" setup>
import { computed, defineProps } from "vue";
import { parseHMC } from "~/logics/harmonyAPI";
import { useAppRoute } from "~/logics/location";
import { appState } from "~/store/app";

const route = useAppRoute();
const props = defineProps<{
  userid?: string;
  uri?: string;
}>();
const host = appState.getHost(route.value.host);

const src = computed(() => {
  if (props.uri) return parseHMC(props.uri, route.value.host);
  if (props.userid) {
    const avatar = host.users[props.userid]?.avatar;
    if (!avatar) return;
    return parseHMC(avatar, route.value.host);
  }
});
</script>
<template>
  <div class="rounded-full bg-gray-500">
    <img :src="src" class="rounded-full" />
  </div>
</template>
