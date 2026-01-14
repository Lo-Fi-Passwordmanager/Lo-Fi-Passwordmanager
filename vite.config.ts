/// <reference types="vitest/config" />

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import {viteSingleFile} from "vite-plugin-singlefile";

export default defineConfig({
  build: {
    target: "esnext",
    minify: false,
    sourcemap: true
  },

  plugins: [wasm(), react(), viteSingleFile()],

  worker: {
    format: "es",
    plugins: () => [wasm()],
  },
    test: {
        environment: "jsdom",
    },
});
