<script setup lang="ts">
import { onMounted, ref, reactive, computed } from "vue";
import { useI18n } from "vue-i18n";
import { Connection } from "@harmony-dev/harmony-web-sdk";
import { useRouter } from "vue-router";
import {
  AuthStep,
  AuthStep_Form_FormField,
  NextStepRequest_FormFields,
} from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/auth/v1/auth";
import type { AuthStream } from "~/types";
import { useHashValue } from "~/logics/location";
import { host, session, userID } from "~/logics/app";
import HCircularProgress from "~/components/HCircularProgress.vue";
import HList from "~/components/HList.vue";
import HListItem from "~/components/HListItem.vue";
import HBtn from "~/components/HBtn.vue";
import HInput from "~/components/HInput.vue";
import HNewPassword from "~/components/HNewPassword.vue";

const selectedHost = useHashValue();
const i18n = useI18n();
const router = useRouter();

const currentStep = ref<"loading" | "choice" | "form">("loading");
const canGoBack = ref(false);
const error = ref<string>("");
const choiceStep = reactive<{
  title?: string;
  choices?: string[];
}>({});
const formStep = reactive<{
  title?: string;
  formFields?: AuthStep_Form_FormField[];
  formFieldValues: (string | number)[];
}>({ formFieldValues: [] });
let authStream: AuthStream | undefined;
let authID: string | undefined;

const conn = new Connection(selectedHost.value);

const selectChoice = async (c: string) => {
  await conn.auth.nextStep({
    authId: authID!,
    step: {
      oneofKind: "choice",
      choice: {
        choice: c,
      },
    },
  });
};

const goBack = () => {
  conn.auth.stepBack({
    authId: authID!,
  });
};

const doneClicked = async () => {
  try {
    await conn.auth.nextStep({
      authId: authID!,
      step: {
        oneofKind: "form",
        form: {
          fields: formStep.formFieldValues.map((f, i) => {
            const field: NextStepRequest_FormFields = NextStepRequest_FormFields.create();
            if (formStep.formFields?.[i].type === "number")
              field.field = {
                oneofKind: "number",
                number: f.toString(),
              };
            else if (
              formStep.formFields?.[i].type === "password" ||
              formStep.formFields?.[i].type === "new-password"
            )
              field.field = {
                oneofKind: "bytes",
                bytes: new TextEncoder().encode(f as string),
              };
            else
              field.field = {
                oneofKind: "string",
                string: f as string,
              };
            return field;
          }),
        },
      },
    });
  } catch (e) {
    const resp = e as Response;
    resp
      .text()
      .then((v) => (error.value = v.substr(2)))
      .catch(() => (error.value = resp.statusText || resp.status.toString()));
  }
};

const onAuthStep = (step: AuthStep) => {
  switch (step.step.oneofKind) {
    case "choice": {
      choiceStep.title = step.step.choice.title;
      choiceStep.choices = step.step.choice.options;
      currentStep.value = "choice";
      break;
    }
    case "form": {
      formStep.title = step.step.form.title!;
      formStep.formFields = step.step.form.fields!;
      formStep.formFieldValues = step.step.form.fields!.map((v) =>
        v.type === "number" ? 0 : ""
      );
      currentStep.value = "form";
      break;
    }
    case "session": {
      host.value = selectedHost.value;
      session.value = step.step.session.sessionToken;
      userID.value = step.step.session.userId;
      router.push({
        path: "/app",
        hash: `#${encodeURIComponent(selectedHost.value)}`,
      });
    }
  }
  canGoBack.value = step.canGoBack;
};

onMounted(async () => {
  const resp = await conn.auth.beginAuth({});
  authID = resp.response.authId;
  authStream = conn.auth.streamSteps({
    authId: resp.response.authId,
  });
  authStream.response.onMessage(onAuthStep);
  onAuthStep(
    await conn.auth.nextStep({
      authId: resp.response.authId,
      step: {
        oneofKind: undefined,
      },
    }).response
  );
});

const allFieldsFilled = computed(() => {
  return formStep.formFieldValues?.every((v) => !!v);
});
</script>

<template>
  <div v-if="currentStep === 'loading'" class="loading-root">
    <h-circular-progress />
  </div>
  <div v-else-if="currentStep === 'choice'" class="w-full">
    <h3 class="text-xl mb-3">{{ $t(`auth.${choiceStep?.title}`) }}</h3>
    <h-list class="bg-gray-200 dark:bg-harmonydark-700">
      <h-list-item
        v-for="choice in choiceStep.choices || []"
        :key="choice"
        v-t="`auth.${choice}`"
        @click="selectChoice(choice)"
      />
    </h-list>
  </div>
  <form v-else-if="currentStep === 'form'" class="w-full">
    <div class="mb-3">
      <h3 v-t="`auth.${formStep?.title}`" class="text-xl" />
      <p v-t="error" class="mb-1 text-red-400" />
    </div>
    <div
      v-for="(field, i) in formStep.formFields || []"
      :key="field.name || ''"
      class="mb-4"
    >
      <h-new-password
        v-if="field.type === 'new-password'"
        @update:model-value="formStep.formFieldValues[i] = $event"
      />
      <h-input
        v-else
        v-model="formStep.formFieldValues[i]"
        :name="field.name || ''"
        :label="i18n.t(`auth.${field.name}`)"
        :type="field.type"
        :autocomplete="field.type"
      />
    </div>
  </form>
  <div class="flex mt-2 justify-end">
    <h-btn
      v-t="'buttons.back'"
      :variant="'text'"
      class="mr-2"
      :disabled="!canGoBack"
      @click="goBack"
    />
    <h-btn
      v-t="'button.next'"
      color="primary"
      :variant="'filled'"
      :disabled="!allFieldsFilled"
      @click="doneClicked"
    />
  </div>
</template>

<style lang="postcss" scoped>
.loading-root {
  @apply w-full flex justify-center content-center;
}
</style>
