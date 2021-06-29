<script lang="ts" setup>
import { ref } from "vue";
import { userID } from "~/logics/app";
import HMenu from "~/components/HMenu.vue";
import { isDark } from "~/logics";

const open = ref(false);
</script>

<template>
  <HMenu v-model="open" full>
    <template #activator="{ toggle }">
      <h-list-item
        class="rounded flex border-t-2 dark:border-harmonydark-600"
        @click="toggle"
      >
        <h-image :userid="userID" class="h-8 mr-3 w-8" rounded />
        <p v-t="'app.profile'" class="flex-1" />
        <mdi-chevron-down v-if="open" />
        <mdi-chevron-up v-else />
      </h-list-item>
    </template>
    <div class="w-full rounded-lg overflow-hidden">
      <h-list>
        <h-list-item @click="isDark = !isDark">
          <ion-moon class="mr-3 my-2" />
          <p v-t="'app.profile-dropdown.theme'" />
        </h-list-item>
        <h-list-item>
          <mdi-cog class="mr-3 my-2" />
          <p v-t="'app.profile-dropdown.settings'" />
        </h-list-item>
      </h-list>
    </div>
  </HMenu>
</template>
