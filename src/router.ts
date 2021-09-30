import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/entry/serverselect",
  },
  {
    path: "/entry",
    redirect: "serverselect",
    component: () => import("./views/entry/Entry.vue"),
    children: [
      {
        path: "serverselect",
        name: "serverselect",
        component: () => import("./views/entry/ServerSelect.vue"),
      },
      {
        path: "auth/:host",
        name: "auth",
        component: () => import("./views/entry/Auth.vue"),
      },
    ],
  },
  {
    path: "/mediasoup",
    component: () => import("./views/mediasoup/MediaSoup.vue"),
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
