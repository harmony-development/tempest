import { createApp } from "vue";
import "virtual:windi.css";
import "~/assets/base.css";
import "~/assets/theme/default.css";
import VWave from "v-wave";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import VueToastificationPlugin from "vue-toastification";
import { router } from "./router";
import App from "./App.vue";
import { API } from "./services/api";
import "vue-toastification/dist/index.css";

dayjs.extend(calendar);

createApp(App)
	.use(VWave, {
		duration: 0.2,
		initialOpacity: 0.4,
		finalOpacity: 0.1,
	})
	.use(VueToastificationPlugin)
	.provide("api", new API())
	.use(router)
	.mount("#app");
