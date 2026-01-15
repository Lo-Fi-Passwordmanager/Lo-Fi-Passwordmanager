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
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['scryptConfig.ts' // excluding since the config is used to reduce scrypt-time during tests only and therefore can't be covered
        ],
        reporter: ['text', 'html', 'lcov'],
        reportsDirectory: './coverage',
      },
    },
});
