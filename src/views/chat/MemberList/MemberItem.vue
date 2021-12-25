<script lang="ts" setup>
import { computed } from "vue";
import Avatar from "~/components/chat/Avatar.vue";
import HListItem from "~/components/shared/Lists/HListItem.vue";
import { chatState } from "../../../logic/store/chat";
import { useChatRoute } from "../../../router";
const props = defineProps<{
  userid: string;
}>();

const { host } = useChatRoute();

const data = computed(() => {
  // console.log(host.value, props.userid);
  return chatState.getUser(host.value!, props.userid);
});
</script>

<template>
  <h-list-item class="gap-4">
    <Avatar :userid="userid" class="h-7 rounded-full" />
    <p class="text-xs overflow-ellipsis overflow-hidden">
      {{ data?.username || "Unknown User" }}
    </p>
  </h-list-item>
</template>
