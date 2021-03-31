<script lang="ts" setup>
import { computed } from "vue";
import { useAppRoute } from "~/logics/location";
import { appState } from "~/store/app";

const route = useAppRoute()

const channelName = computed(() => appState.getChannel(route.value.host, route.value.channelid as string).name)
</script>

<template>
    <h3 v-if="channelName"> <mdi-pound class="text-lg text-gray-200" /> {{ channelName }} </h3>
</template>