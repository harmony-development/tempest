<script lang="ts" setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";

import HListItem from "~/components/HListItem.vue";
import { useAppRoute } from "~/logic/location";
import { appState } from "~/store/app";
import ContextMenu from "~/components/shared/ContextMenu.vue";
import { getOrFederate } from "~/logic/connections";

const props = defineProps<{
  id: string;
}>();

const route = useAppRoute();
const router = useRouter();

const data = computed(() => appState.getChannel(route.value.host, props.id));

const onClick = () => {
  router.push({
    params: {
      host: route.value.host,
      channelid: props.id,
    },
  });
};

const deleteChannel = async () => {
  const conn = await getOrFederate(route.value.host);
  conn.chat.deleteChannel({
    guildId: route.value.guildid,
    channelId: props.id,
  });
};
</script>

<template>
  <context-menu>
    <template #activator="{ open }">
      <h-list-item
        :selected="props.id === route.channelid"
        class="overflow-ellipsis"
        @click="onClick"
        @contextmenu.prevent="open"
      >
        <mdi-pound class="mr-1 text-lg" />
        {{ data.name }}
      </h-list-item>
    </template>
    <h-list class="bg-surface-900 shadow-md">
      <h-list-item danger @click="deleteChannel">
        <mdi-delete class="mr-3" /> Delete Channel
      </h-list-item>
    </h-list>
  </context-menu>
</template>
