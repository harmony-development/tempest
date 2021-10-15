<script lang="ts" setup>
import { computed } from "vue";
import { chatState } from "../../logic/store/chat";
import HImg from "../shared/HImg.vue";
import { useChatRoute } from "../../router";

const { host } = useChatRoute();

const props = defineProps<{
  userid: string;
}>();
const profile = computed(
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
