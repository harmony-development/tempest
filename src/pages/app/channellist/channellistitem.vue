<script lang="ts" setup>
import { defineProps } from "vue";
import HListItem from "~/components/HListItem.vue";
import { useAppRoute } from "~/logics/location";
import { appState } from "~/store/app";

const props = defineProps<{
  id: string;
}>();

const route = useAppRoute();

const data = appState.getChannel(route.value.host, props.id);
</script>

<template>
  <h-list-item>
    {{ data.name }}
  </h-list-item>
</template>
