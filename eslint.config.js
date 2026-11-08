import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import { globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import uiPlugin from "./packages/ui/eslint/index.js";

export default [
  globalIgnores(["**/dist/**", "**/coverage/**", "**/node_modules/**"]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    // Copy lives in each package's src/copy/, so it can be reviewed in one place (packages/ui/COPY.md).
    files: ["packages/*/src/**/*.tsx", "apps/*/src/**/*.tsx"],
    ignores: ["**/src/copy/**", "**/*.test.tsx"],
    plugins: { ui: uiPlugin },
    rules: {
      "ui/no-jsx-copy": "error",
    },
  },
];
