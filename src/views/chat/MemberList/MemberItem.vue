<script lang="ts" setup>
import { computed } from "vue";
import { AccountKind } from "@harmony-dev/harmony-web-sdk/dist/gen/profile/v1/types";
import { chatState } from "../../../logic/store/chat";
import BaseListItem from "~/components/base/BaseListItem.vue";
import Avatar from "~/components/chat/Avatar.vue";
const props = defineProps<{
	userid: string
	host: string
}>();
const data = computed(() => chatState.getUser(props.host, props.userid));
</script>

<template>
  <base-list-item compact>
    <avatar :userid="userid" class="h-7 rounded-full" />
    <p class="text-xs overflow-ellipsis overflow-hidden">
      {{ data?.username || "Unknown User" }}
    </p>
    <span v-if="data?.kind === AccountKind.BOT" class="p-1 text-xs text-gray-300 ml-1 bg-surface-500">
      BOT
    </span>
  </base-list-item>
</template>
