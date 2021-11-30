import "windi.css";
import { ViteSSG } from "vite-ssg";
import { setupLayouts } from "layouts-generated";
import { createWebHashHistory } from "vue-router";
import App from "./App.vue";
import { appRoutes } from "~/router";
import "hint.css";

const routes = setupLayouts(appRoutes);

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  {
    routes,
    history: createWebHashHistory(),
  },
  (ctx) => {
    // install all modules under `modules/`
    Object.values(import.meta.globEager("./modules/*.ts")).map((i) =>
      i.install?.(ctx)
    );
  }
);
