import VWave from "v-wave";
import { UserModule } from "~/types";

export const install: UserModule = async ({ app }) => {
  app.use(VWave, {
    duration: 0.2,
    initialOpacity: 0.2,
    finalOpacity: 0.05,
  });
};
