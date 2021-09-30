<script lang="ts" setup>
import { useAuthRoute } from "../../logic/routeParams";
import { Connection } from "@harmony-dev/harmony-web-sdk";
import { onMounted, ref } from "vue";
import {
  AuthStep,
  StreamStepsResponse,
} from "@harmony-dev/harmony-web-sdk/dist/gen/auth/v1/auth";
import Choices from "./Choices.vue";
import Form from "./Form.vue";
import { AuthManager } from "~/logic/api/auth";

const params = useAuthRoute();
let manager: AuthManager | undefined = undefined;
const canGoBack = ref(false);
const currentStep = ref<AuthStep["step"] | undefined>(undefined);
const error = ref<unknown | undefined>(undefined);

const onStep = ({ step }: StreamStepsResponse) => {
  console.log("step received");
  if (!step) return;
  canGoBack.value = step.canGoBack;
  currentStep.value = step.step;
};

onMounted(async () => {
  try {
    manager = await AuthManager.create(params.value.host);
    manager.stream.response.onMessage(onStep);
    manager.sendStep({ oneofKind: undefined });
  } catch (e) {
    error.value = e;
  }
});

const onChoiceDone = async (c: string) => {
  await manager?.sendChoice(c);
};

const onFormDone = async (data: string[]) => {
  await manager?.sendForm(data);
};
</script>

<template>
  <div class="text-center" v-if="error">
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
      @done="onChoiceDone"
    />
    <Form
      v-else-if="currentStep?.oneofKind === 'form'"
      :form="currentStep.form"
      @done="onFormDone"
    />
    <div v-else>
      <mdi-loading class="transform animate-spin" />
    </div>
  </div>
</template>
