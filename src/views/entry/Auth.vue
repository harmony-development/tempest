<script lang="ts" setup>
import { useAuthManager } from "../../logic/api/auth";
import { useAuthRoute } from "../../logic/routeParams";
import Choices from "./Choices.vue";
import EntryForm from "./EntryForm.vue";
import BaseSpinner from "~/components/base/BaseSpinner.vue";
import BaseButton from "~/components/base/BaseButton.vue";
const params = useAuthRoute();
const { back, error, currentStepType, currentStep, sendChoice, sendForm, isLoading } = useAuthManager(params.value.host);
</script>

<template>
  <base-button class="w-min" square variant="outlined" @click="back">
    <mdi-arrow-left />
  </base-button>
  <div v-if="currentStepType === 'fatal'" class="text-center">
    <mdi-alert class="text-3xl textgray-300" />
    <p>{{ $t('failed-to-connect-to-server') }}</p>
    <p class="text-sm text-gray-400 italic">
      {{ error }}
    </p>
  </div>
  <div v-else class="p-2">
    <choices v-if="currentStep?.oneofKind === 'choice'" :choice="currentStep.choice" :error="error" @done="sendChoice" />
    <entry-form v-else-if="currentStep?.oneofKind === 'form'" :form="currentStep.form" :error="error" :is-loading="isLoading" @done="sendForm" />
    <div v-if="currentStepType === 'loading'" class="text-center flexcol items-center gap-3">
      <base-spinner class="text-4xl" />
      <span class="font-bold uppercase">{{ $t('loading') }}</span>
    </div>
  </div>
</template>
