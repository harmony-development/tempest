<script setup lang="ts">
import { onMounted, ref, reactive, computed } from "vue";
import { useI18n } from "vue-i18n";
import { Connection } from "@harmony-dev/harmony-web-sdk";
import { useRouter } from "vue-router";
import gen from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/auth/v1/output";
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
  formFields?: gen.protocol.auth.v1.AuthStep.Form.IFormField[];
  formFieldValues: (string | number)[];
}>({ formFieldValues: [] });
let authStream: AuthStream | undefined;
let authID: string | undefined;

const conn = new Connection(selectedHost);

const selectChoice = async (c: string) => {
  const req = new gen.protocol.auth.v1.NextStepRequest.Choice();
  req.choice = c;

  onAuthStep(
    await conn.auth.NextStep({
      authId: authID,
      choice: req,
    })
  );
};

const goBack = () => {
  conn.auth.StepBack({
    authId: authID,
  });
};

const doneClicked = async () => {
  try {
    onAuthStep(
      await conn.auth.NextStep({
        authId: authID,
        form: {
          fields: formStep.formFieldValues.map((f, i) => {
            const field: gen.protocol.auth.v1.NextStepRequest.IFormFields = {};
            if (formStep.formFields?.[i].type === "number")
              field.number = f as number;
            else if (
              formStep.formFields?.[i].type === "password" ||
              formStep.formFields?.[i].type === "new-password"
            )
              field.bytes = new TextEncoder().encode(f as string);
            else field.string = f as string;
            return field;
          }),
        },
      })
    );
  } catch (e) {
    const resp = e as Response;
    resp
      .text()
      .then((v) => (error.value = v.substr(2)))
      .catch(() => (error.value = resp.statusText || resp.status.toString()));
  }
};

const onAuthStep = (step: gen.protocol.auth.v1.AuthStep) => {
  if (step.choice) {
    const choice = step.choice;
    choiceStep.title = choice.title!;
    choiceStep.choices = choice.options!;
    currentStep.value = "choice";
  } else if (step.form) {
    const form = step.form;
    formStep.title = form.title!;
    formStep.formFields = form.fields!;
    formStep.formFieldValues = form.fields!.map((v) =>
      v.type === "number" ? 0 : ""
    );
    currentStep.value = "form";
  } else if (step.session) {
    host.value = selectedHost;
    session.value = step.session.sessionToken!;
    userID.value = step.session.userId!;
    router.push({
      path: "/app",
      hash: `#${encodeURIComponent(selectedHost)}`,
    });
  }
  canGoBack.value = step.canGoBack!;
};

onMounted(async () => {
  const resp = await conn.auth.BeginAuth({});
  authID = resp.authId;
  authStream = conn.auth.StreamSteps();
  authStream.eventEmitter.on("open", async () => {
    authStream!.send({
      authId: resp.authId,
    });
  });
  authStream!.eventEmitter.on("data", onAuthStep);
  onAuthStep(
    await conn.auth.NextStep({
      authId: resp.authId,
    })
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
    <h3 v-t="`auth.${choiceStep?.title}`" class="text-xl mb-3" />
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
      v-t="'buttons.done'"
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
