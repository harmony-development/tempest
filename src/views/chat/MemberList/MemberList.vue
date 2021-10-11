<script lang="ts" setup>
import HListItem from "~/components/shared/HListItem.vue";
import HImg from "~/components/shared/HImg.vue";
import { computed, watch } from "vue";
import { chatState } from "../../../logic/store/chat";
import { useChatRoute } from "../../../router";
import Avatar from "~/components/chat/Avatar.vue";
import { connectionManager } from "../../../logic/api/connections";

const { host, guild } = useChatRoute();
const members = computed(
  () => chatState.getGuild(host.value!, guild.value!).members
);

watch([host, guild], async () => {
  const currentHost = host.value;
  const currentGuild = guild.value;
});
</script>

<template>
  <div class="w-48">
    <ol>
      <h-list-item class="gap-2" v-for="m in members" :key="m">
        <Avatar :userid="m" />
        {{ m }}
      </h-list-item>
    </ol>
  </div>
</template>
