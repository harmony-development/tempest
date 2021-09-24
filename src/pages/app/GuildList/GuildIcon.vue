<script setup lang="ts">
import { computed, defineProps, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import GuildIconMenu from "./GuildIconMenu.vue";
import HMenu from "~/components/HMenu.vue";
import { host } from "~/logic/app";
import { getOrFederate } from "~/logic/connections";
import { parseHMC } from "~/logic/utils/parsing";
import { appState } from "~/store/app";
import HImage from "~/components/shared/Image/HImage.vue";

const route = useRoute();
const router = useRouter();
const props = defineProps<{
  id: string;
  host: string;
}>();

const guildHost = props.host || host.value;

const guildMenu = ref(false);
const error = ref<string | undefined>(undefined);

const selected = computed(() => props.id === route.params.guildid);
const data = computed(() => appState.getGuild(guildHost, props.id));

onMounted(async () => {
  if (!data.value.name || !data.value.picture) {
    try {
      const conn = await getOrFederate(guildHost);
      const { response } = await conn.chat.getGuild({ guildId: props.id });
      appState.setGuildInfo(guildHost, props.id, {
        name: response.guild!.name,
        picture: parseHMC(
          response.guild!.picture,
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
        v-tippy="{ content: data.name, placement: 'right' }"
        :class="{
          'guild-icon': true,
          selected,
        }"
        @click.prevent.stop="onClick"
        @mousedown.prevent=""
        @contextmenu.prevent="toggle"
      >
        <h-image
          :uri="data.picture"
          :fallback="data.name"
          rounded
          class="object-cover"
          style="aspect-ratio: 1"
          draggable="false"
          :alt="data.name"
        />
      </button>
    </template>
    <guild-icon-menu :id="props.id" :host="guildHost" />
  </h-menu>
</template>

<style lang="postcss" scoped>
.guild-icon {
  @apply outline-none rounded-full border-2 border-transparent block transform duration-100 h-14 w-14;

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
