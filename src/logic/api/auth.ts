import { Connection } from "@harmony-dev/harmony-web-sdk";
import {
  AuthStep,
  NextStepRequest,
  NextStepRequest_FormFields,
  StreamStepsRequest,
  StreamStepsResponse,
} from "@harmony-dev/harmony-web-sdk/dist/gen/auth/v1/auth";
import { ServerStreamingCall } from "@protobuf-ts/runtime-rpc";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { session } from "../store/session";

type AuthStream = ServerStreamingCall<StreamStepsRequest, StreamStepsResponse>;

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

export const useAuthManager = (host: string) => {
  const router = useRouter();

  const currentStepType = ref<
    "loading" | "fatal" | AuthStep["step"]["oneofKind"]
  >("loading");
  const currentStep = ref<AuthStep["step"] | undefined>();
  const error = ref<string | undefined>(undefined);
  const canGoBack = ref<boolean>(true);
  const goingBack = ref<boolean>(false);
  const title = ref<string | undefined>(undefined);
  const choices = ref<string[]>([]);

  const authManager = new AuthManager(host);

  const goToServerSelect = () => {
    router.push({
      name: "serverselect",
    });
  };

  const back = async () => {
    goingBack.value = true;
    try {
      if (!canGoBack.value || currentStepType.value === "loading")
        goToServerSelect();
      await authManager.sendBack();
    } catch (e) {
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
      if (currentStep.value?.oneofKind !== "form") return;
      await authManager.nextStep({
        oneofKind: "form",
        form: {
          fields: currentStep.value.form.fields.map((v, i) => ({
            field: getFormField(values[i], v.type),
          })),
        },
      });
    } catch (e) {
      error.value = formatError(e, "entry.error.sending-form");
    }
  };

  const onStep = (step: AuthStep["step"]) => {
    if (step.oneofKind === "session") {
      const { sessionToken, userId } = step.session;
      session.value = {
        session: sessionToken,
        userID: userId,
        host,
      };
      return router.push({ name: "chat" });
    }
    error.value = undefined;
    currentStepType.value = step.oneofKind;
    currentStep.value = step;
  };

  const onStepOuter = (step: AuthStep) => {
    canGoBack.value = step.canGoBack;
    onStep(step.step);
  };

  onMounted(async () => {
    try {
      await authManager.start();
      authManager.stream?.responses.onMessage((resp) =>
        onStepOuter(resp.step!)
      );
      onStepOuter(
        (await authManager.nextStep({ oneofKind: undefined }).response).step!
      );
    } catch (e) {
      console.warn(e);
      currentStepType.value = "fatal";
    }
  });

  return {
    back,
    goingBack,
    sendForm,
    sendChoice,
    currentStepType,
    currentStep,
    title,
    choices,
    error,
  };
};
