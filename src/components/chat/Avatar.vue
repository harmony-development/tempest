<script lang="ts" setup>
import { computed } from "vue";
import { chatState } from "../../logic/store/chat";
import HImg from "../shared/HImg.vue";
import { useChatRoute } from "../../router";
import { parseHMC } from '../../logic/parsing';

const { host } = useChatRoute();

const props = defineProps<{
  userid: string;
  override?: string;
}>();
const profile = computed(
  () => chatState.getUser(host.value!, props.userid),
  undefined
);
const uri = computed(() => {
  if (props.override) return parseHMC(props.override, host.value!);
  return profile.value?.picture && host.value && parseHMC(profile.value.picture, host.value)
});
</script>

<template>
  <HImg
    :fallback="profile?.username[0] || userid[0]"
    :src="uri"
    class="bg-primary-800 hover:bg-primary-900 rounded-xl square inline-flex"
  />
</template>
