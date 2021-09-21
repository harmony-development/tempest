import { createPinia } from "pinia";
import { UserModule } from "~/types";

export const install: UserModule = async ({ app }) => {
  app.use(createPinia());
};
