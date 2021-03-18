<script setup lang="ts">
import { computed, defineProps, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { host } from "~/logics/app";

import { getOrFederate } from "~/logics/connections";
import { useAppRoute } from "~/logics/location";
import { appState } from "~/store/app";

const { selectedGuildId } = useAppRoute();
const router = useRouter();
const props = defineProps<{
  id: number;
  host: string;
}>();

const guildHost = props.host || host.value;

const error = ref<string | undefined>(undefined);

const selected = computed(() => props.id === selectedGuildId);
const data = computed(() => appState.getGuild(guildHost, props.id));

onMounted(async () => {
  if (!data.value.name || !data.value.picture) {
    try {
      const conn = await getOrFederate(guildHost);
      console.log(props.id);
      const resp = await conn.chat.GetGuild({ guildId: props.id });
      appState.setGuildInfo(guildHost, props.id, {
        name: resp.guildName,
        picture: resp.guildPicture,
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
      guildid: props.id,
    },
  });
};
</script>

<template>
  <button
    v-wave
    :class="{ 'guild-icon': true, selected }"
    @click.prevent.stop="onClick"
    @mousedown.prevent=""
  >
    <img
      :src="data.picture"
      class="rounded-full object-cover outline-none h-14 w-14 inline"
      draggable="false"
    />
  </button>
</template>

<style lang="postcss" scoped>
.guild-icon {
  @apply outline-none rounded-full border-2 border-transparent block mb-1 transform duration-100;

  &:hover {
    transform: translateY(-3px);
    @apply shadow-sm;
  }
}

.selected {
  @apply border-primary-400;
}
</style>
