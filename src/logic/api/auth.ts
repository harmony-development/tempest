import { Connection } from "@harmony-dev/harmony-web-sdk";
import {
  AuthStep,
  AuthStep_Form_FormField,
  NextStepRequest,
  NextStepRequest_FormFields,
  StreamStepsRequest,
  StreamStepsResponse,
} from "@harmony-dev/harmony-web-sdk/dist/gen/auth/v1/auth";
import { ServerStreamingCall } from "@protobuf-ts/runtime-rpc";

type AuthStream = ServerStreamingCall<StreamStepsRequest, StreamStepsResponse>;

export class AuthManager {
  authID: string;
  conn: Connection;
  stream: AuthStream;
  currentStep: AuthStep["step"] | undefined;

  private constructor(conn: Connection, stream: AuthStream, authID: string) {
    this.conn = conn;
    this.stream = stream;
    this.authID = authID;
  }

  // AuthManager is asynchronous so it needs to use a helper function for the constructor
  static async create(host: string) {
    const conn = new Connection(host);
    const { authId } = await conn.auth.beginAuth({}).response;
    const stream = conn.auth.streamSteps({ authId: authId });
    return new AuthManager(conn, stream, authId);
  }

  sendStep(step: NextStepRequest["step"]) {
    return this.conn.auth.nextStep({
      authId: this.authID,
      step,
    });
  }

  sendChoice(c: string) {
    return this.sendStep({
      oneofKind: "choice",
      choice: {
        choice: c,
      },
    });
  }

  getFormField(f: string, type: string): NextStepRequest_FormFields["field"] {
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

  sendForm(data: string[]) {
    if (this.currentStep?.oneofKind !== "form") return;
    return this.sendStep({
      oneofKind: "form",
      form: {
        fields: this.currentStep.form.fields.map<NextStepRequest_FormFields>(
          (field, i) => ({
            field: this.getFormField(data[i], field.type),
          })
        ),
      },
    });
  }
}
