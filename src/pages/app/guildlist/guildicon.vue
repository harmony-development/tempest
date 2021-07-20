<script setup lang="ts">
import { computed, defineProps, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import GuildIconMenu from "./GuildIconMenu.vue";
import HMenu from "~/components/HMenu.vue";
import { host } from "~/logics/app";
import { getOrFederate } from "~/logics/connections";
import { parseHMC } from "~/logics/harmonyAPI";
import { appState } from "~/store/app";

const route = useRoute();
const router = useRouter();
const props = defineProps<{
  id: string;
  host: string;
}>();

const guildHost = props.host || host.value;

const guildMenu = ref(false);
const imageError = ref(false);
const error = ref<string | undefined>(undefined);

const selected = computed(() => props.id === route.params.guildid);
const data = computed(() => appState.getGuild(guildHost, props.id));

onMounted(async () => {
  if (!data.value.name || !data.value.picture) {
    try {
      const conn = await getOrFederate(guildHost);
      const resp = await conn.chat.getGuild({ guildId: props.id });
      appState.setGuildInfo(guildHost, props.id, {
        name: resp.response.guildName,
        picture: parseHMC(
          resp.response.guildPicture,
          guildHost.replace(/\/$/, "")
        ),
      });
    } catch (e) {
      if (e instanceof Response) {
        error.value = e.statusText;
      }
    }
  }
});

const onClick = () => {
  router.push({
    params: {
      host: host.value,
      guildid: props.id,
      channelid: "",
      messageid: "",
    },
  });
};
</script>

<template>
  <h-menu v-model="guildMenu">
    <template #activator="{ toggle }">
      <button
        v-wave
        :class="{
          'guild-icon': true,
          selected,
          'hint--right': true,
          bg: imageError,
        }"
        :aria-label="data.name"
        @click.prevent.stop="onClick"
        @mousedown.prevent=""
        @contextmenu.prevent="toggle"
      >
        <img
          v-show="!imageError"
          :src="data.picture"
          class="
            rounded-full
            h-full
            object-cover
            outline-none
            text-center
            w-full
            text-4xl
            leading-14
          "
          draggable="false"
          :alt="data.name"
          @error="imageError = true"
        />
        <p v-if="imageError" class="text-xl">{{ data.name?.[0] }}</p>
      </button>
    </template>
    <guild-icon-menu :id="props.id" :host="guildHost" />
  </h-menu>
</template>

<style lang="postcss" scoped>
.guild-icon {
  @apply outline-none rounded-full border-2 border-transparent block mb-1 transform duration-100 h-14 w-14;

  &:hover {
    transform: translateY(-3px);
    @apply shadow-sm;
  }
}

.bg {
  @apply bg-gray-200 dark:bg-gray-600;
}

.selected {
  @apply border-primary-400;
}
</style>
