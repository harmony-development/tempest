import { createApp } from "vue";
import "virtual:windi.css";
import "~/assets/base.css";
import "~/assets/theme/default.css";
import VWave from "v-wave";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import VueToastificationPlugin from "vue-toastification";
import { createI18n } from "vue-i18n";
import { router } from "./router";
import App from "./App.vue";
import { API } from "./services/api";
import "vue-toastification/dist/index.css";

dayjs.extend(calendar);

const messages = Object.fromEntries(
	Object.entries(
		import.meta.globEager("./locales/*.json"))
		.map(([key, value]) => {
			// remove extension and path
			return [key.slice(10, -5), (value as any).default];
		}),
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
	.use(createI18n({
		locale: "en",
		legacy: false,
		globalInjection: true,
		messages,
	}))
	.mount("#app");
