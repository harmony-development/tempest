<script lang="ts" setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import AddChannelDialog from "./AddChannelDialog.vue";
import { useAppRoute } from "~/logic/location";
import { appState } from "~/store/app";
import HBtn from "~/components/shared/HBtn.vue";

const route = useAppRoute();
const { t } = useI18n();

const addChannelOpen = ref(false);
const guildName = computed(
  () => appState.getGuild(route.value.host, route.value.guildid).name
);
</script>

<template>
  <div class="flex items-center p-3 dark:bg-harmonydark-700">
    <h1>{{ guildName }}</h1>
    <div class="flex-1" />
    <h-btn
      v-tippy="{ content: t('app.add-channel') }"
      icon
      variant="text"
      dense
      @click="addChannelOpen = true"
    >
      <mdi-plus />
    </h-btn>
    <add-channel-dialog v-model="addChannelOpen" />
  </div>
</template>
