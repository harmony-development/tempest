<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import HAppBar from "~/components/HAppBar.vue";
import HSpacer from "~/components/HSpacer.vue";
import HBtn from "~/components/HBtn.vue";
import HMenu from "~/components/HMenu.vue";
import HList from "~/components/HList.vue";
import HListItem from "~/components/HListItem.vue";
import { toggleDark } from "~/logics/dark";

const { availableLocales, locale } = useI18n();
const i18nMenu = ref(false);
</script>

<template>
  <h-app-bar absolute>
    <h1 v-t="'app-name'" class="text-lg" />
    <h-spacer />
    <h-menu v-model="i18nMenu">
      <template #activator="{ toggle }">
        <h-btn variant="text" icon @click="toggle">
          <ic-round-translate />
        </h-btn>
      </template>
      <h-list class="bg-white dark:bg-black">
        <h-list-item
          v-for="lang in availableLocales"
          :key="lang"
          :selected="locale === lang"
          @click="locale = lang"
        >
          {{ lang }}
        </h-list-item>
      </h-list>
    </h-menu>
    <h-btn variant="text" icon @click="toggleDark">
      <ion-moon />
    </h-btn>
  </h-app-bar>
  <div
    class="
      flex
      h-full
      w-full
      items-center
      justify-center
      background
      sm:justify-start
    "
  >
    <div
      class="
        bg-white
        rounded
        p-6
        w-11/12
        sm:m-12 sm:w-2/3
        md:w-5/12
        dark:bg-harmonydark-800
      "
    >
      <router-view />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.background {
  background: repeating-linear-gradient(
    45deg,
    rgba(127, 127, 127, 0.05),
    rgba(127, 127, 127, 0.05) 10px,
    transparent 10px,
    transparent 20px
  );
  background-repeat: repeat;
  fill: black;
}
</style>
