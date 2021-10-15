<script lang="ts" setup>
import { computed } from "vue";
import { chatState } from "../../../logic/store/chat";
import { useChatRoute } from "../../../router";
import Avatar from "~/components/chat/Avatar.vue";

const props = defineProps<{
  userid: string;
}>();

const { host } = useChatRoute();

const data = computed(() => {
  console.log(host.value, props.userid);
  return chatState.getUser(host.value!, props.userid);
});
</script>

<template>
  <h-list-item class="gap-2 rounded-md">
    <Avatar :userid="userid" class="h-7 rounded-full" />
    <p class="overflow-ellipsis overflow-hidden">
      {{ data?.username }}
    </p>
  </h-list-item>
</template>
