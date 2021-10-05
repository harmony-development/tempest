<script lang="ts" setup>
import { useAuthRoute } from "../../logic/routeParams";
import Choices from "./Choices.vue";
import Form from "./Form.vue";
import { AuthManager, useAuthManager } from "../../logic/api/auth";
import { useRouter } from "vue-router";

const params = useAuthRoute();
const router = useRouter();
const {
  back,
  goingBack,
  error,
  currentStepType,
  currentStep,
  sendChoice,
  sendForm,
} = useAuthManager(params.value.host);
</script>

<template>
  <h-btn class="w-min" square variant="outlined" @click="back">
    <mdi-arrow-left />
  </h-btn>
  <div class="text-center" v-if="currentStepType === 'fatal'">
    <mdi-alert class="text-3xl textgray-300" />
    <p>Failed to connect to server</p>
    <p class="text-sm text-gray-400 italic">
      {{ error }}
    </p>
  </div>
  <div class="p-2" v-else>
    <Choices
      v-if="currentStep?.oneofKind === 'choice'"
      :choice="currentStep.choice"
      @done="sendChoice"
      :error="error"
    />
    <Form
      v-else-if="currentStep?.oneofKind === 'form'"
      :form="currentStep.form"
      @done="sendForm"
      :error="error"
    />
    <div v-if="currentStepType === 'loading'">
      <mdi-loading class="transform animate-spin" />
    </div>
  </div>
</template>
