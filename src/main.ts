import "windi.css";
import { ViteSSG } from "vite-ssg";
import { setupLayouts } from "layouts-generated";
import App from "./App.vue";
import { appRoutes } from "~/router";

const routes = setupLayouts(appRoutes);

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(App, { routes }, (ctx) => {
  // install all modules under `modules/`
  Object.values(import.meta.globEager("./modules/*.ts")).map((i) =>
    i.install?.(ctx)
  );
});
