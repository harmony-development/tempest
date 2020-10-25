import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    redirect: "/entry/serverselect",
  },
  {
    path: "/entry",
    component: () => import("@/views/Entry.vue"),
    children: [
      {
        path: "",
        redirect: "/entry/serverselect",
      },
      {
        path: "serverselect",
        component: () => import("@/views/entry/ServerSelect.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
