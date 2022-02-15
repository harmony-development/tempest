<script lang="ts" setup>
import type { Ref } from "vue";
import { computed, ref } from "vue";
import { parseHMC } from "../../logic/parsing";
import { chatState } from "../../logic/store/chat";
import { useChatRoute } from "../../router";
import BaseImage from "../base/BaseImage.vue";

const { host } = useChatRoute();

const props = defineProps<{
	userid?: string
	override?: string
}>();
const profile = computed(() => {
	if (!props.userid) return;
	return chatState.getUser(host.value!, props.userid);
});
const uri = computed(() => {
	if (props.override) return parseHMC(props.override, host.value!);
	if (!profile.value?.picture || !host.value) return;
	return parseHMC(profile.value.picture, host.value);
});
</script>

<template>
  <base-image
    :fallback="profile?.username[0] || userid?.[0] || '?'"
    :src="uri"
    class="bg-primary-800 hover:bg-primary-900 rounded-full square inline-flex"
    v-bind="$attrs"
  />
</template>
