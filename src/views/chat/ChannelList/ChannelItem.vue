<script lang="ts" setup>
import { ChannelKind } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/channels";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { chatState } from "../../../logic/store/chat";
import { useChatRoute } from "../../../router";
const props = defineProps<{
	channelid: string;
}>();
const router = useRouter();
const { host, guild, channel: selectedChannel } = useChatRoute();
const channel = computed(() => chatState.getChannel(host.value!, guild.value!, props.channelid));
const data = computed(() => channel.value.data);
const goToChannel = () => {
	chatState.getGuild(host.value!, guild.value!).lastChannel = props.channelid;
	return router.push({ params: { channel: props.channelid } });
};
</script>

<template>
	<li class="channel-item" :class="{ selected: selectedChannel === channelid }" variant="sided" @click="goToChannel">
		<mdi-pound v-if="data?.kind === ChannelKind.TEXT_UNSPECIFIED" class="text-base text-gray-400" />
		<mdi-volume v-else class="text-base text-gray-400" />
		<span class="text-md ml-2">{{ data?.name }}</span>
	</li>
</template>

<style lang="postcss" scoped>
.channel-item {
	@apply flex items-center gap-2 cursor-pointer py-2 px-3 select-none hover:bg-surface-500 transition duration-200 border-l-0 border-white;
}

.selected {
	@apply bg-surface-500 border-l-4 border-primary-300;
}
</style>
