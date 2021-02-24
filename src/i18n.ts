import { createI18n } from "vue-i18n";
import messages from "@intlify/vite-plugin-vue-i18n/messages";

const i18n = createI18n({
  locale: "en",
  legacy: false,
  messages,
});

export default i18n;
