import { createApp } from "vue";
import "virtual:windi.css";
import "~/assets/base.css";
import "~/assets/theme/default.css";
import App from "./App.vue";
import VWave from "v-wave";
import { router } from "./router";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import VueTippy from "vue-tippy";
import "tippy.js/dist/tippy.css";

dayjs.extend(calendar);

createApp(App)
  .use(VWave, {
    duration: 0.2,
    initialOpacity: 0.4,
    finalOpacity: 0.1,
  })
  .use(VueTippy, {
    directive: "tippy",
  })
  .use(router)
  .mount("#app");
