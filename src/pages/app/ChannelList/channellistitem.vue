<script lang="ts" setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";

import HListItem from "~/components/HListItem.vue";
import { useAppRoute } from "~/logics/location";
import { appState } from "~/store/app";

const props = defineProps<{
  id: string;
}>();

const route = useAppRoute();
const router = useRouter();

const data = appState.getChannel(route.value.host, props.id);

const onClick = () => {
  router.push({
    params: {
      host: route.value.host,
      channelid: props.id,
    },
  });
};
</script>

<template>
  <h-list-item
    :selected="props.id === route.channelid"
    class="overflow-ellipsis"
    @click="onClick"
  >
    <mdi-pound class="mr-1 text-lg" />
    {{ data.name }}
  </h-list-item>
</template>
