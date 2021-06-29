import { RouteRecordRaw } from "vue-router";
import serverselectVue from "./pages/entry/serverselect.vue";
import entryVue from "./pages/entry.vue";
import authVue from "./pages/entry/auth.vue";
import appVue from "./pages/app/app.vue";

export const appRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/entry/serverselect",
  },
  {
    path: "/entry",
    component: entryVue,
    children: [
      {
        path: "/serverselect",
        component: serverselectVue,
      },
      {
        name: "authpage",
        path: "/auth/:host?",
        component: authVue,
      },
    ],
  },
  {
    name: "app",
    path: "/app/:host/:guildid?/:channelid?/:messageid?",
    component: appVue,
  },
];
