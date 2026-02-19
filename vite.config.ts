/// <reference types="vitest/config" />

// vite.config.ts
import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import {viteSingleFile} from "vite-plugin-singlefile";
import path from "node:path";
import os from "node:os";
import process from "node:process";
import {configDefaults} from "vitest/config";
//playwright coverage
import istanbul from 'vite-plugin-istanbul'

export default defineConfig({
    build: {
        target: "esnext",
        minify: false,
        sourcemap: true
    },

    plugins: [wasm(), react(), viteSingleFile(),
        process.env.E2E &&
        istanbul({
            include: 'src/*',
            extension: ['.js', '.ts', '.jsx', '.tsx'],
            requireEnv: false,
        }),
    ].filter(Boolean),

    worker: {
        format: "es",
        plugins: () => [wasm()]
    },
    test: {
        environment: "jsdom",
        exclude: [
            ...configDefaults.exclude,
            "e2e"
        ],
        coverage: {
            enabled: true,
            reportOnFailure: true,
            provider: "v8",
            include: ["src/**/*.{ts,tsx}"],
            exclude: ["scryptConfig.ts", // excluding since the config is used to reduce scrypt-time during tests only and therefore can't be covered
                "src/Components/Views",
                "main.tsx"
            ],
            reporter: ["text", "html", "lcov"],
            reportsDirectory: "./coverage"
        },
        setupFiles: ["./tests/testSetup.ts"],
        globals: true,
        execArgv: [
            "--localstorage-file",
            path.resolve(os.tmpdir(), `vitest-${process.pid}.localstorage`)
        ]
    }
});
