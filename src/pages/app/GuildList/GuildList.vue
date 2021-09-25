<script setup lang="ts">
import { useI18n } from "vue-i18n";
import GuildIcon from "./GuildIcon.vue";
import GuildBtn from "./GuildBtn.vue";
import { host } from "~/logic/app";
import { useGuildList } from "~/logic/api/api";

const { t } = useI18n();

const { guildList, error } = useGuildList(host);
</script>

<template>
  <div class="bg-white bg-surface-700 p-2 flex flex-col gap-2 w-19">
    <div v-if="error" class="text-center p-3 text-red-400">
      <mdi-alert class="text-xl" />
      <p>
        {{ t("app.guilds.error") }}
      </p>
      <p class="break-words">
        {{ error }}
      </p>
    </div>
    <template
      v-for="guild in guildList"
      :key="`${guild.guildId}:${guild.host}`"
    >
      <guild-icon :id="guild.guildId" :host="guild.host" />
      <hr class="border-surface-500" />
    </template>
    <guild-btn />
  </div>
</template>
