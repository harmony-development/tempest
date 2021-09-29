import { createApp } from "vue";
import "virtual:windi.css";
import "~/assets/base.css";
import "~/assets/theme/default.css";
import App from "./App.vue";
import VWave from "v-wave";
import { router } from "./router";

createApp(App)
  .use(VWave, {
    duration: 0.2,
    initialOpacity: 0.4,
    finalOpacity: 0.1,
  })
  .use(router)
  .mount("#app");
