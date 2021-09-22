<script lang="ts" setup>
import { ref } from "vue";
import { host, userID } from "~/logic/app";
import HMenu from "~/components/HMenu.vue";
import { isDark } from "~/logic";
import { useUser } from "~/logic/fetcher";
import { dialogState } from "~/store/dialogs";

const open = ref(false);

const ownUser = useUser(userID.value, host.value);

const openUserSettings = () => {
  open.value = false;
  dialogState.state.userSettingsOpen = !dialogState.state.userSettingsOpen;
};
</script>

<template>
  <HMenu v-model="open" full close-on-click>
    <template #activator="{ toggle }">
      <h-list-item
        class="rounded flex border-t-2 dark:border-harmonydark-600"
        @click="toggle"
      >
        <h-image :userid="userID" class="h-8 mr-3 w-8" rounded />
        <p class="flex-1">{{ ownUser?.username }}</p>
        <mdi-chevron-down v-if="open" />
        <mdi-chevron-up v-else />
      </h-list-item>
    </template>
    <div class="w-full rounded-lg overflow-hidden dark:bg-black bg-white">
      <h-list>
        <h-list-item @click="isDark = !isDark">
          <ion-moon class="mr-3 my-2" />
          <p v-t="'app.profile-dropdown.theme'" />
        </h-list-item>
        <h-list-item @click="openUserSettings">
          <mdi-cog class="mr-3 my-2" />
          <p v-t="'app.profile-dropdown.settings'" />
        </h-list-item>
      </h-list>
    </div>
  </HMenu>
</template>
