import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/auth/serverselect",
  },
  {
    path: "/auth",
    redirect: "serverselect",
    component: () => import("./views/auth/Auth.vue"),
    children: [
      {
        path: "serverselect",
        name: "serverselect",
        component: () => import("./views/auth/ServerSelect.vue"),
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
