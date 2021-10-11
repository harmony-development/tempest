<script lang="ts" setup>
import { computed } from "vue";
import HListItem from "~/components/shared/HListItem.vue";
import { chatState } from "../../../logic/store/chat";
import { useChatRoute } from "../../../router";
import { ChannelKind } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/channels";
import { useRouter } from "vue-router";

const { channelid } = defineProps<{
  channelid: string;
}>();

const router = useRouter();
const { host, guild, channel } = useChatRoute();

const data = computed(() =>
  chatState.getChannel(host?.value!, guild?.value!, channelid)
);

const goToChannel = () => router.push({ params: { channel: channelid } });
</script>

<template>
  <h-list-item :selected="channel === channelid" @click="goToChannel">
    <mdi-pound
      class="text-base text-gray-400"
      v-if="data.data?.kind === ChannelKind.TEXT_UNSPECIFIED"
    />
    <mdi-volume class="text-lg text-gray-400" v-else />
    <span class="ml-2">
      {{ data.data?.name }}
    </span>
  </h-list-item>
</template>
