import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { resolve } from "path";

export default defineConfig({
  plugins: [solid()],
  build: {
    target: "esnext",
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    lib: {
      entry: resolve(import.meta.dirname, "src/index.tsx"),
      name: "MyWidget",
      fileName: () => "bundle.js",
      formats: ["iife"],
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: "bundle.js",
        assetFileNames: "bundle.[ext]",
      },
    },
  },
});
