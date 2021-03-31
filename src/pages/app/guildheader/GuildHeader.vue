<script lang="ts" setup>
import { computed, ref } from "vue";
import AddChannelDialog from "./AddChannelDialog.vue"
import { useAppRoute } from "~/logics/location";
import { appState } from "~/store/app";
import HBtn from "~/components/HBtn.vue"

const route = useAppRoute()
const addChannelOpen = ref(false)
const guildName = computed(() => appState.getGuild(route.value.host, route.value.guildid as string).name)
</script>

<template>
    <div class="flex items-center p-3 bg-harmonydark-700">
        <h1>{{ guildName }}</h1>
        <div class="flex-1" />
        <h-btn icon variant="text" dense :aria-label="$t('app.add-channel')" class="hint--bottom" @click="addChannelOpen = true">
            <mdi-plus />
        </h-btn>
        <add-channel-dialog v-model="addChannelOpen" />
    </div>
</template>