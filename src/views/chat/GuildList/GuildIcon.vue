<script lang="ts" setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { parseHMC } from "../../../logic/parsing";
import { chatState } from "../../../logic/store/chat";
import type { IMenuOption } from "../../../components/base/BaseMenu.vue";
import { useAPI } from "../../../services/api";
import BaseImage from "~/components/base/BaseImage.vue";
import BaseTooltip from "~/components/base/BaseTooltip.vue";
import BaseMenu from "~/components/base/BaseMenu.vue";
import { uiState } from "~/logic/store/ui";

const props = defineProps<{
	active?: boolean
	host: string
	guildid: string
}>();

const api = useAPI();
const { t } = useI18n();

const guild = computed(() => chatState.getGuild(props.host, props.guildid), undefined);
const iconSrc = computed(() => (guild.value.data?.picture ? parseHMC(guild.value.data.picture, props.host) : undefined));

const menuOptions: IMenuOption[] = [
	{
		text: t("leave-guild"),
		level: "danger",
		async onClick() {
			await uiState.openConfirm(t("leave-guild-0"), t("are-you-sure-you-would-like-to-leave-guild-value-data-name", [guild.value.data?.name]));
			await api.leaveGuild(props.host, props.guildid);
		},
	},
];
</script>

<template>
  <base-menu :options="menuOptions">
    <template #activator="{activate}">
      <base-tooltip :text="guild.data?.name" placement="right">
        <button
          v-wave
          v-bind="$attrs"
          role="button"
          class="icon"
          :class="{ active }"
          style="aspect-ratio: 1"
          @contextmenu.prevent="activate"
        >
          <base-image
            :src="iconSrc"
            class="object-contain pointer-events-none"
            draggable="false"
            :alt="guild?.data?.name"
            :fallback="guild?.data?.name?.[0]"
          />
        </button>
      </base-tooltip>
    </template>
  </base-menu>
</template>

<style lang="postcss" scoped>
.icon {
	@apply w-full
      bg-surface-500
      rounded-full
      cursor-pointer
      overflow-hidden
      flex-shrink-0
      select-none
      border-primary-300
      transition transition-all
      duration-100
      border-0;
	&:active {
		@apply border-4 bg-surface-600;
	}
  &:focus {
		@apply border-5;
	}
}

.active {
	@apply border-2;
}
</style>
