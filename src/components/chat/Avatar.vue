<script lang="ts" setup>
import { computed } from "vue";
import { chatState } from "../../logic/store/chat";
import HImg from "../shared/HImg.vue";
import { asyncComputed } from "@vueuse/core";
import { useChatRoute } from "../../router";

const { host } = useChatRoute();

const props = defineProps<{
  userid: string;
}>();
const profile = asyncComputed(
  () => chatState.getUser(host.value!, props.userid),
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
