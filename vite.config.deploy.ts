/// <reference types="vitest/config" />

// vite.config.ts
import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";

export default defineConfig({
    build: {
        target: "esnext",
        minify: true
    },

    plugins: [wasm(), react()],

    worker: {
        format: "es",
        plugins: () => [wasm()],
    },
    test: {
        environment: "node",
    },
});
