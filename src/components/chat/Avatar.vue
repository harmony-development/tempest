<script lang="ts" setup>
import type { Ref } from "vue";
import { computed, ref } from "vue";
import { parseHMC } from "../../logic/parsing";
import { chatState } from "../../logic/store/chat";
import { useChatRoute } from "../../router";
import BaseImage from "../base/BaseImage.vue";

const { host } = useChatRoute();

const avatarInput = ref() as Ref<HTMLInputElement>;
const emit = defineEmits(["change", "blur"]);
const props = defineProps<{
	userid?: string
	override?: string
}>();
const avatar = ref();
const profile = computed(() => (props.userid ? chatState.getUser(host.value!, props.userid) : undefined), undefined);
const uri = computed(() => {
	if (props.override) return parseHMC(props.override, host.value!);
	return profile.value?.picture && host.value && parseHMC(profile.value.picture, host.value);
});

const onChange = (event: Event) => {
	const file = (event.target as HTMLInputElement).files![0];
	avatar.value = URL.createObjectURL(file);
	emit("change", file);
};
</script>

<template>
  <base-image
    :fallback="profile?.username[0] || userid?.[0] || '?'"
    :src="uri"
    class="bg-primary-800 hover:bg-primary-900 rounded-full square inline-flex"
    v-bind="$attrs"
    @click="avatarInput.click()"
  />
</template>
