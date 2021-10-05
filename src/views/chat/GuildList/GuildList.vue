<script lang="ts" setup>
import { computed, onMounted } from "vue";
import GuildIcon from "./GuildIcon.vue";
import { connectionManager } from "../../../logic/api/connections";
import { session } from "../../../logic/store/session";
import { chatState } from "../../../logic/store/chat";
import { fromV1 } from "~/logic/types/guilds";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(async () => {
  const conn = connectionManager.get(session.value!.host);
  const { guilds } = await conn.chat.getGuildList({}).response;
  chatState.state.guildList = guilds.map(fromV1);
});

const guildList = computed(() => chatState.state.guildList);

const goToGuild = (host: string, guildID: string) => {
  router.push({
    name: "chat",
    params: {
      host,
      guildID,
    },
  });
};
</script>

<template>
  <div class="list">
    <div
      class="
        w-18
        p-2
        flex flex-col
        gap-2
        h-full
        overflow-y-scroll
        no-scrollbar
        z-1
        relative
        bg-surface-900
      "
    >
      <GuildIcon
        v-for="{ host, guildID } in guildList"
        :key="`${host}-${guildID}`"
        name="a"
        src="a"
        @click="goToGuild(host, guildID)"
      />
    </div>
    <button class="add-menu-pop" v-wave>
      <mdi-plus />
    </button>
  </div>
</template>

<style lang="postcss" scoped>
.list {
  @apply h-full overflow-visible relative w-min;

  &:hover > .add-menu-pop {
    @apply left-full visible;
  }
}

.add-menu-pop {
  @apply absolute
        text-xl
        bg-primary-600
        rounded-r-xl
        top-1/2
        left-0
        flex
        py-9
        z-0
        transition transition-all duration-100
        invisible;
}
</style>
