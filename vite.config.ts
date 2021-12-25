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
	server: {
		https: true,
	},
	test: {
		global: true,
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
		mkcert(),
		{
			...visualizer({
				template: "sunburst",
				brotliSize: true,
			}),
			enforce: "post",
			apply: "build",
		},
		VitePWA({
			includeAssets: ["/favicon.svg", "/favicon.ico", "robots.txt", "/apple-touch-icon.png"],
			manifest: {
				name: "Tempest",
				short_name: "Tempest",
				description: "Web frontend for the Harmony Protocol powered by Vue",
				theme_color: "#818DF8",
				background_color: "#181921",
				icons: [
					{
						src: "/pwa/android-chrome-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/pwa/android-chrome-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "/pwa/android-chrome-maskable-192x192.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "maskable",
					},
					{
						src: "/pwa/android-chrome-maskable-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
					{
						src: "/pwa/apple-touch-icon-60x60.png",
						sizes: "60x60",
						type: "image/png",
					},
					{
						src: "/pwa/apple-touch-icon-76x76.png",
						sizes: "76x76",
						type: "image/png",
					},
					{
						src: "/pwa/apple-touch-icon-120x120.png",
						sizes: "120x120",
						type: "image/png",
					},
					{
						src: "/pwa/apple-touch-icon-152x152.png",
						sizes: "152x152",
						type: "image/png",
					},
					{
						src: "/pwa/apple-touch-icon-180x180.png",
						sizes: "180x180",
						type: "image/png",
					},
					{
						src: "/pwa/apple-touch-icon.png",
						sizes: "180x180",
						type: "image/png",
					},
					{
						src: "/pwa/favicon-16x16.png",
						sizes: "16x16",
						type: "image/png",
					},
					{
						src: "/pwa/favicon-32x32.png",
						sizes: "32x32",
						type: "image/png",
					},
					{
						src: "/pwa/msapplication-icon-144x144.png",
						sizes: "144x144",
						type: "image/png",
					},
					{
						src: "/pwa/mstile-150x150.png",
						sizes: "150x150",
						type: "image/png",
					},
				],
			},
		}),
	],
});
