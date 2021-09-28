import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import visualizer from "rollup-plugin-visualizer";

export default defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
    },
  },
  plugins: [
    vue(),
    {
      ...visualizer({
        template: "sunburst",
        brotliSize: true,
      }),
      enforce: "post",
      apply: "build",
    },
  ],
});
