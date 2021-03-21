<script lang="ts" setup>
import { defineProps } from "vue";
import HListItem from "~/components/HListItem.vue";
import { useAppRoute } from "~/logics/location";
import { appState } from "~/store/app";
import HImage from "~/components/HImage.vue";

const props = defineProps<{
  userid: string;
}>();
const route = useAppRoute();

const user = appState.getUser(route.value.host, props.userid);
</script>

<template>
  <h-list-item>
    <h-image :userid="props.userid" class="h-8 mr-3 w-8" rounded />
    {{ user?.username }}
  </h-list-item>
</template>
