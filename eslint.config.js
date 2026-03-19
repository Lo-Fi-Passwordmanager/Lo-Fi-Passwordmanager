import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";
import {defineConfig, globalIgnores} from "eslint/config";

export default defineConfig([
    globalIgnores(["dist", "node_modules", "coverage"]),

    {
        files: ["src/**/*.{ts,tsx}"],
        extends: [
            js.configs.recommended,

            // TypeScript (type-aware)
            ...tseslint.configs.recommendedTypeChecked,

            // React
            react.configs.flat.recommended,

            // Hooks
            reactHooks.configs.flat.recommended,

            // Vite Fast Refresh
            reactRefresh.configs.vite,
        ],

        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: globals.browser,
            parserOptions: {
                // Point to the specific configs, not the empty "solution" root
                project: ["./tsconfig.app.json", "./tsconfig.node.json"],
                // Use the current directory as the base for those paths
                tsconfigRootDir: import.meta.dirname,
            },
        },

        settings: {
            react: {
                version: "detect",
            },
        },

        plugins: {
            import: importPlugin,
        },

        rules: {
            /* -----------------------------
             * TypeScript
             * --------------------------- */

            "@typescript-eslint/no-unused-vars": [
                "warn",
                {argsIgnorePattern: "^_", varsIgnorePattern: "^_"},
            ],

            "@typescript-eslint/consistent-type-imports": "error",

            "@typescript-eslint/no-misused-promises": "error",

            "@typescript-eslint/no-floating-promises": "error",

            "@typescript-eslint/explicit-function-return-type": "off",

            /* -----------------------------
             * React
             * --------------------------- */

            "react/react-in-jsx-scope": "off", // Not needed with new JSX transform

            "react/prop-types": "off", // Using TypeScript instead

            "react/jsx-uses-react": "off",

            "react/jsx-boolean-value": ["warn", "never"],

            "react/self-closing-comp": "warn",

            /* -----------------------------
             * Imports
             * --------------------------- */

            "import/order": [
                "warn",
                {
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        ["parent", "sibling", "index"],
                    ],
                    alphabetize: {order: "asc", caseInsensitive: true},
                    "newlines-between": "always",
                },
            ],
        },
    },
]);
