/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import visualizer from "rollup-plugin-visualizer";
import mkcert from "vite-plugin-mkcert";
import { VitePWA } from "vite-plugin-pwa";
import Icons from "unplugin-icons/vite";
import WindiCSS from "vite-plugin-windicss";
import Components from "unplugin-vue-components/vite";
import IconsResolver from "unplugin-icons/resolver";
import vueJsx from "@vitejs/plugin-vue-jsx";
// loader helpers
import { FileSystemIconLoader } from "unplugin-icons/loaders";

export default defineConfig({
	resolve: {
		alias: {
			"~/": `${path.resolve(__dirname, "src")}/`,
		},
	},
	plugins: [
		vue(),
		vueJsx(),
		WindiCSS(),
		Icons({
			compiler: "vue3",
			defaultStyle: "",
			customCollections: {
				h: FileSystemIconLoader("./src/assets/icons"),
			},
		}),
		Components({
			resolvers: [
				IconsResolver({
					prefix: "",
					customCollections: ["h"],
				}),
			],
			dts: true,
		}),
		VitePWA({
			includeAssets: ["/favicon.svg", "/favicon.ico", "robots.txt", "/apple-touch-icon.png"],
			manifest: {
				name: "Tempest",
				short_name: "Tempest",
				description: "Web frontend for the Harmony Protocol powered by Vue",
				theme_color: "#2f303e",
				icons: [
					{
						src: "/pwa-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "/pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any maskable",
					},
				],
			},
		}),
		mkcert(),
		{
			...visualizer({
				template: "sunburst",
				brotliSize: true,
			}),
			enforce: "post",
			apply: "build",
		},
	],
	server: {
		https: true,
	},
	test: {
		global: true,
	},
});
