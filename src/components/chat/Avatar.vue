<script lang="ts" setup>
import { computed } from "vue";
import { chatState } from "../../logic/store/chat";
import HImg from "../shared/HImg.vue";
const { host, userid } = defineProps<{
  host?: string;
  userid: string;
}>();
const profile = computed(() => chatState.getUser(host, userid));
</script>

<template>
  <HImg
    :fallback="profile?.username[0] || userid[0]"
    :src="profile?.picture"
    class="bg-primary-800 hover:bg-primary-900 p-2 rounded-xl square"
  />
</template>
