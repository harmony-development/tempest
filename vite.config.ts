import path from "path";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import Layouts from "vite-plugin-vue-layouts";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import WindiCSS from "vite-plugin-windicss";
import { VitePWA } from "vite-plugin-pwa";
import VueI18n from "@intlify/vite-plugin-vue-i18n";
import visualizer from "rollup-plugin-visualizer";
import ViteFonts from "vite-plugin-fonts";

export default defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
    },
  },
  plugins: [
    Vue({
      include: [/\.vue$/],
    }),

    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "vue-i18n",
        "@vueuse/head",
        "@vueuse/core",
      ],
      dts: true,
    }),

    ViteFonts({
      google: {
        families: ["Roboto"],
      },
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),
    // https://github.com/antfu/vite-plugin-components
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ["vue"],
      dts: true,
      // auto import icons
      resolvers: [
        // https://github.com/antfu/vite-plugin-icons
        IconsResolver({
          componentPrefix: "",
          // enabledCollections: ['carbon']
        }),
      ],
    }),

    // https://github.com/antfu/vite-plugin-icons
    Icons(),

    // https://github.com/antfu/vite-plugin-windicss
    WindiCSS({
      safelist: "prose prose-sm m-auto",
    }),

    // https://github.com/antfu/vite-plugin-pwa
    VitePWA({
      manifest: {
        name: "Vitesse",
        short_name: "Vitesse",
        theme_color: "#ffffff",
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

    // https://github.com/intlify/vite-plugin-vue-i18n
    VueI18n({
      include: [path.resolve(__dirname, "locales/**")],
    }),
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
    fs: {
      strict: true,
    },
  },
  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    script: "async",
    formatting: "minify",
  },
  optimizeDeps: {
    include: ["vue", "vue-router", "@vueuse/core"],
    exclude: ["vue-demi", "v-wave"],
  },
});
