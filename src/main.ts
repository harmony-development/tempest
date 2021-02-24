import { createApp } from "vue";
import VWave from 'v-wave'
import App from "./App.vue";
import i18n from "./i18n";
import "./index.css";
import router from "./router";

createApp(App).use(router).use(i18n).use(VWave).mount("#app");
