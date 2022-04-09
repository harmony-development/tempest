import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import VWave from "v-wave";
import "virtual:windi.css";
import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import VueToastificationPlugin from "vue-toastification";
import "vue-toastification/dist/index.css";
import "~/assets/base.css";
import "~/assets/theme/default.css";
import App from "./App.vue";
import { router } from "./router";
import { API } from "./services/api";

dayjs.extend(calendar);

const messages = Object.fromEntries(
	Object.entries(import.meta.globEager("./locales/*.json")).map(([key, value]) => {
		// remove extension and path
		return [key.slice(10, -5), (value as any).default];
	})
);

createApp(App)
	.use(VWave, {
		duration: 0.2,
		initialOpacity: 0.4,
		finalOpacity: 0.1,
	})
	.use(VueToastificationPlugin)
	.provide("api", new API())
	.use(router)
	.use(
		createI18n({
			locale: "en",
			legacy: false,
			globalInjection: true,
			messages,
		})
	)
	.mount("#app");
