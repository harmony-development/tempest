<script lang="ts" setup>
import { computed, defineProps, ref } from "vue";
import { useI18n } from "vue-i18n";
import { UserStatus } from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/harmonytypes/v1/types";
import HListItem from "~/components/HListItem.vue";
import { useAppRoute } from "~/logic/location";
import { appState } from "~/store/app";
import HImage from "~/components/shared/Image/HImage.vue";
import HMenu from "~/components/HMenu.vue";

const props = defineProps<{
  userid: string;
}>();

const route = useAppRoute();
const { t } = useI18n();

const menuOpen = ref(false);

const user = computed(() => appState.getUser(route.value.host, props.userid));
</script>

<template>
  <HMenu v-model="menuOpen" direction="left">
    <template #activator="{ toggle }">
      <h-list-item class="rounded" @click="toggle">
        <h-image square :userid="props.userid" class="h-8 mr-3 w-8" rounded />
        <p class="flex-1">{{ user?.username }}</p>
      </h-list-item>
    </template>
    <h-card>
      <div class="flex gap-4 items-center">
        <h-image
          :userid="props.userid"
          class="w-12 rounded-full border-2"
          square
          :class="{
            'border-green-400': user.status === UserStatus.STREAMING,
            'border-green-400': user.status === UserStatus.ONLINE_UNSPECIFIED,
            'border-yellow-400': user.status === UserStatus.IDLE,
            'border-gray-400': user.status === UserStatus.OFFLINE,
          }"
        />
        <div>
          <p class="font-bold">{{ user.username }}</p>
          <p class="text-gray-400">{{ t(`app.user-status.${user.status}`) }}</p>
        </div>
      </div>
    </h-card>
  </HMenu>
</template>
