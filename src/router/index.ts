import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/entry",
    name: "Entry",
    component: () => import("../app/entry/index.vue"),
    children: [
      {
        path: "serverselect",
        name: "Server Select",
        component: () => import("../app/entry/serverselect.vue"),
      },
      {
        path: "auth",
        name: "Auth",
        component: () => import("../app/entry/auth.vue"),
      },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
