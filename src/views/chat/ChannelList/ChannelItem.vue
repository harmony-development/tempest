<script lang="ts" setup>
import { ChannelKind } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/channels";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { chatState } from "../../../logic/store/chat";
import { useChatRoute } from "../../../router";
import BaseListItem from "~/components/base/BaseListItem.vue";
const props = defineProps<{
	channelid: string
}>();
const router = useRouter();
const { host, guild, channel } = useChatRoute();
const data = computed(() => chatState.getChannel(host.value!, guild.value!, props.channelid));
const goToChannel = () => {
	chatState.getGuild(host.value!, guild.value!).lastChannel = props.channelid;
	router.push({ params: { channel: props.channelid } });
};
</script>

<template>
  <base-list-item :selected="channel === channelid" variant="sided" @click="goToChannel">
    <mdi-pound v-if="data.data?.kind === ChannelKind.TEXT_UNSPECIFIED" class="text-base text-gray-400" />
    <mdi-volume v-else class="text-base text-gray-400" />
    <span class="text-md ml-2">{{ data.data?.name }}</span>
  </base-list-item>
</template>
