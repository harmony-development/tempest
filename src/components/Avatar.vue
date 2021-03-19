<script lang="ts" setup>
import { defineProps, onMounted, ref } from "vue";
import { parseHMC } from "~/logics/harmonyAPI";
import { useAppRoute } from "~/logics/location";
import { appState } from "~/store/app";

const route = useAppRoute();
const props = defineProps<{
  userid: string;
}>();

const src = ref<string | undefined>(undefined);

onMounted(async () => {
  const user = appState.getUser(route.value.host, props.userid);
  if (!user?.avatar) return;
  src.value = parseHMC(user?.avatar, route.value.host);
});
</script>
<template>
  <img v-if="src" :src="src" />
</template>
