import VueTippy from "vue-tippy";
import { UserModule } from "~/types";
import "tippy.js/dist/tippy.css";

export const install: UserModule = async ({ app }) => {
  app.use(VueTippy);
};
