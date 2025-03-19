import { defineConfig } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends("eslint:all"),

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.jquery,
            Plotly: "readonly",
        },

        ecmaVersion: "latest",
        sourceType: "module",
    },

    rules: {
        "array-bracket-newline": "off",
        "array-element-newline": "off",

        camelcase: ["error", {
            properties: "never",
        }],

        "capitalized-comments": "off",
        "function-call-argument-newline": "off",
        "func-names": "off",
        "func-style": ["off"],
        "id-length": "off",

        indent: ["error", 2, {
            SwitchCase: 1,
        }],

        "init-declarations": "off",
        "lines-around-comment": "off",
        "line-comment-position": "off",
        "logical-assignment-operators": "off",
        "max-depth": ["error", 5],
        "max-len": "off",
        "max-lines": "off",
        "max-lines-per-function": "off",
        "max-params": "off",
        "max-statements": "off",
        "multiline-comment-style": "off",
        "newline-after-var": "off",
        "no-alert": "warn",
        "no-inline-comments": "off",

        "no-magic-numbers": ["warn", {
            ignore: [-1, 0, 1, 2, 4, 100],
            ignoreArrayIndexes: true,
        }],

        "no-mixed-operators": "off",
        "no-unused-vars": "warn",
        "no-param-reassign": "off",
        "no-plusplus": "off",
        "no-shadow": "off",
        "no-use-before-define": "off",
        "one-var": ["error", "never"],
        "padded-blocks": ["error", "never"],
        "padding-line-between-statements": "off",
        "prefer-destructuring": "off",
        quotes: ["error", "single"],
        "quote-props": ["error", "as-needed"],
        semi: ["error", "never"],
        "sort-keys": "off",

        "space-before-function-paren": ["error", {
            anonymous: "always",
            named: "never",
        }],
    },
}]);