<script lang="ts" setup>
import { ChannelKind } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/channels";
import { computed } from "vue";
import { useRouter } from "vue-router";
import HListItem from "~/components/shared/Lists/HListItem.vue";
import { chatState } from "../../../logic/store/chat";
import { useChatRoute } from "../../../router";

const props = defineProps<{
  channelid: string;
}>();

const router = useRouter();
const { host, guild, channel } = useChatRoute();

const data = computed(() =>
  chatState.getChannel(host?.value!, guild?.value!, props.channelid)
);

const goToChannel = () => {
  chatState.getGuild(host.value!, guild.value!).lastChannel = props.channelid;
  router.push({ params: { channel: props.channelid } });
};
</script>

<template>
  <h-list-item :selected="channel === channelid" @click="goToChannel">
    <mdi-pound
      class="text-base text-gray-400"
      v-if="data.data?.kind === ChannelKind.TEXT_UNSPECIFIED"
    />
    <mdi-volume class="text-base text-gray-400" v-else />
    <span class="text-md ml-2">{{ data.data?.name }}</span>
  </h-list-item>
</template>
