import { computed } from "vue";
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from "vue-router";
import { createRouter, createWebHashHistory, useRoute } from "vue-router";
import { session } from "./logic/store/session";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		redirect: "/entry/serverselect",
	},
	{
		path: "/playground",
		component: () => import("./views/playground/Playground.vue"),
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
		path: "/chat/:host?/:guild?/:channel?/:message?",
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
	if (to.meta.auth && !session.value)
		next({ name: "serverselect" });
	else
		next();
});

export interface ChatRoute extends RouteLocationNormalizedLoaded {
	params: {
		host?: string
		guild?: string
		channel?: string
		message?: string
	}
}

export const useChatRoute = () => {
	const route = useRoute() as ChatRoute;
	return {
		host: computed(() => route.params.host === session.value?.host ? "" : route.params.host),
		guild: computed(() => route.params.guild),
		channel: computed(() => route.params.channel),
		message: computed(() => route.params.message),
	};
};
