import { createApp } from "vue";
import HTooltipVue from "~/components/HTooltip.vue";
import { UserModule } from "~/types";

export const install: UserModule = async ({ app }) => {
  app.directive("tooltip", {
    mounted(el: HTMLElement, { value }) {
      const tooltip = createApp(HTooltipVue, {
        activator: el,
      }).mount(el);
      el.addEventListener("mouseenter", tooltip);
    },
  });
};
