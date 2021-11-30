import { Connection } from "@harmony-dev/harmony-web-sdk";
import {
  AuthStep,
  AuthStep_Choice,
  AuthStep_Form,
  AuthStep_Form_FormField,
  NextStepRequest,
  NextStepRequest_FormFields,
  Session,
} from "@harmony-dev/harmony-web-sdk/dist/gen/auth/v1/auth";
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, reactive, ref } from "vue";
import { host, session, userID } from "../app";
import { AuthStream } from "~/types";

export class AuthManager {
  conn: Connection;
  authID: string | undefined;
  stream: AuthStream | undefined;
  currentStep: AuthStep["step"] | undefined;

  constructor(host: string) {
    this.conn = new Connection(host);
  }

  async start() {
    const resp = await this.conn.auth.beginAuth({});
    this.authID = resp.response.authId;
    this.stream = this.conn.auth.streamSteps({
      authId: this.authID,
    });
    return resp;
  }

  sendBack() {
    return this.conn.auth.stepBack({
      authId: this.authID!,
    });
  }

  nextStep(content: NextStepRequest["step"]) {
    return this.conn.auth.nextStep({
      authId: this.authID!,
      step: content,
    });
  }
}

function getFormField(
  f: string,
  type: string
): NextStepRequest_FormFields["field"] {
  switch (type) {
    case "password":
    case "new-password":
      return {
        oneofKind: "bytes",
        bytes: new TextEncoder().encode(f),
      };
    default:
      return {
        oneofKind: "string",
        string: f.toString(),
      };
  }
}

export const useAuthManager = () => {
  const route = useRoute();
  const router = useRouter();

  const currentStep = ref<"loading" | "fatal" | AuthStep["step"]["oneofKind"]>(
    "loading"
  );
  const error = ref<string | undefined>(undefined);
  const canGoBack = ref<boolean>(true);
  const goingBack = ref<boolean>(false);
  const title = ref<string | undefined>(undefined);
  const choices = ref<string[]>([]);
  const formFields = ref<AuthStep_Form_FormField[]>([]);
  const formFieldValues = reactive<string[]>([]);
  const selectedHost = computed(() => route.params.host as string);

  const authManager = new AuthManager(selectedHost.value);

  const goToServerSelect = () => {
    router.push({
      name: "serverselect",
    });
  };

  const back = async () => {
    goingBack.value = true;
    try {
      if (!canGoBack.value || currentStep.value === "loading")
        goToServerSelect();
      await authManager.sendBack();
    } catch {
      goToServerSelect();
    }
    goingBack.value = false;
  };

  const formatError = (e: any, fallback: string) => {
    if (e instanceof Error) {
      return e.message;
    } else {
      return fallback;
    }
  };

  const sendChoice = async (c: string) => {
    try {
      await authManager.nextStep({
        oneofKind: "choice",
        choice: {
          choice: c,
        },
      });
    } catch (e) {
      error.value = formatError(e, "entry.error.sending-choice");
    }
  };

  const sendForm = async (values: string[]) => {
    try {
      await authManager.nextStep({
        oneofKind: "form",
        form: {
          fields: formFields.value.map((v, i) => ({
            field: getFormField(values[i], v.type),
          })),
        },
      });
    } catch (e) {
      error.value = formatError(e, "entry.error.sending-form");
    }
  };

  const onChoice = (step: AuthStep_Choice) => {
    title.value = step.title;
    choices.value = step.options;
  };

  const onForm = (step: AuthStep_Form) => {
    title.value = step.title;
    formFields.value = step.fields;
    formFieldValues.splice(
      0,
      formFieldValues.length,
      ...step.fields.map(() => "")
    );
  };

  const onSession = (s: Session) => {
    host.value = selectedHost.value;
    session.value = s.sessionToken;
    userID.value = s.userId;
    router.push({
      name: "app",
    });
  };

  const onStep = (step: AuthStep["step"]) => {
    error.value = undefined;
    currentStep.value = step.oneofKind;
    switch (step.oneofKind) {
      case "choice":
        onChoice(step.choice);
        break;
      case "form":
        onForm(step.form);
        break;
      case "session":
        onSession(step.session);
        break;
      default:
    }
  };

  const onStepOuter = (step: AuthStep) => {
    canGoBack.value = step.canGoBack;
    onStep(step.step);
  };

  onMounted(async () => {
    try {
      await authManager.start();
      authManager.stream?.response.onMessage((resp) => onStepOuter(resp.step!));
      onStepOuter(
        (await authManager.nextStep({ oneofKind: undefined }).response).step!
      );
    } catch (e) {
      console.warn(e);
      currentStep.value = "fatal";
    }
  });

  return {
    back,
    goingBack,
    sendForm,
    sendChoice,
    currentStep,
    title,
    formFieldValues,
    formFields,
    choices,
    error,
  };
};
