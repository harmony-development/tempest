<script lang="ts" setup>
import { computed } from "vue";
import { chatState } from "../../logic/store/chat";
import HImg from "../shared/HImg.vue";
import { useAsyncState } from "@vueuse/core";
const { host, userid } = defineProps<{
  host?: string;
  userid: string;
}>();
const { state: profile } = useAsyncState(
  () => chatState.getUser(host!, userid),
  undefined
);
</script>

<template>
  <HImg
    :fallback="profile?.username[0] || userid[0]"
    :src="profile?.picture"
    class="bg-primary-800 hover:bg-primary-900 p-2 rounded-xl square"
  />
</template>
