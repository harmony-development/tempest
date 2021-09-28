<script lang="ts" setup>
import { parseHMC } from "../../../logic/utils/parsing";
import { useAppRoute } from "~/logic/location";
import { appState } from "~/store/app";

const props = defineProps<{
  userid: string;
}>();

const route = useAppRoute();

const user = computed(() => appState.getUser(route.value.host, props.userid));

const src = computed(() => {
  return user.value?.avatar
    ? parseHMC(user.value.avatar, route.value.host)
    : undefined;
});
const fallback = computed(() => user.value?.username);
</script>

<template>
  <h-image :src="src" :fallback="fallback" class="bg-secondary-800" />
</template>
