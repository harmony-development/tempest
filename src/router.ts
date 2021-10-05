import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { session } from "./logic/store/session";

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
    path: "/chat",
    name: "chat",
    component: () => import("./views/chat/Chat.vue"),
    meta: { auth: true },
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  if (to.meta.auth && !session.value) {
    next({ name: "serverselect" });
  } else {
    next();
  }
});
