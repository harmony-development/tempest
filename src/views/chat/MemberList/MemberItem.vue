<script lang="ts" setup>
import { computed } from "vue";
import { chatState } from "../../../logic/store/chat";
import { useChatRoute } from "../../../router";
import BaseListItem from "~/components/base/BaseListItem.vue";
import Avatar from "~/components/chat/Avatar.vue";
const props = defineProps<{
	userid: string
}>();
const { host } = useChatRoute();
const data = computed(() => chatState.getUser(host.value!, props.userid));
</script>

<template>
  <base-list-item compact>
    <avatar :userid="userid" class="h-7 rounded-full" />
    <p class="text-xs overflow-ellipsis overflow-hidden">
      {{ data?.username || "Unknown User" }}
    </p>
  </base-list-item>
</template>
