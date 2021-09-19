<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useEventListener } from "@vueuse/core";
import { useAuthManager } from "~/logic/api/auth";
import HListItem from "~/components/HListItem.vue";
import HSpinner from "~/components/HSpinner.vue";
import { useHotKeys } from "~/logic/utils/hotkey";
const {
  sendChoice,
  sendForm,
  formFields,
  formFieldValues,
  back,
  goingBack,
  currentStep,
  title,
  choices,
  error,
} = useAuthManager();

const { t } = useI18n();

const formFilled = computed(() => {
  return formFieldValues.every((v) => !!v);
});

useHotKeys((ev) => {
  if (document.activeElement?.tagName === "INPUT") return;
  ev.preventDefault();
  ev.key === "b" && back();
});
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="inline-flex items-center">
      <h-btn-v2 outlined icon @click="back">
        <h-spinner v-if="goingBack" />
        <mdi-arrow-left v-else />
      </h-btn-v2>
      <kbd class="ml-1">b</kbd>
      <h3 v-if="title" class="text-lg ml-4">
        {{ t(`h.auth.${title}`) }}
      </h3>
    </div>

    <div
      class="bg-red-500 hidden transition-all px-3 py-0 duration-200"
      :class="{ 'error-active': !!error }"
    >
      {{ error }}
    </div>

    <div
      v-if="currentStep === 'loading'"
      class="w-full flex flex-col items-center gap-3"
    >
      <h-spinner />
      <p v-t="'common.loading'" />
    </div>
    <div v-else-if="currentStep === 'fatal'" class="text-center">
      <mdi-alert class="text-3xl" />
      <p v-t="'entry.fatal-error'" />
      <router-link
        v-t="'entry.auth.return-to-selection'"
        :to="{ name: 'serverselect' }"
        class="text-blue-300 underline"
      />
    </div>
    <div v-if="currentStep === 'choice'">
      <h-list class="bg-harmonydark-900">
        <h-list-item v-for="c in choices" :key="c" @click="sendChoice(c)">
          {{ c }}
        </h-list-item>
      </h-list>
    </div>
    <div v-if="currentStep === 'form'">
      <div class="flex flex-col gap-2 mb-3">
        <template v-for="(f, i) in formFields" :key="f.name">
          <h-input
            v-model="formFieldValues[i]"
            :label="f.name"
            :type="f.type"
          />
        </template>
      </div>
      <div v-if="currentStep === 'form'" class="flex justify-end">
        <h-btn-v2
          v-t="'buttons.next'"
          outlined
          :disabled="!formFilled"
          @click="sendForm(formFieldValues)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.error-active {
  @apply p-3 block;
}
</style>
