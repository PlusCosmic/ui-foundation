import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "packages/*/src/**/*.test.{ts,tsx}",
      "packages/*/eslint/**/*.test.js",
      "apps/*/src/**/*.test.{ts,tsx}",
    ],
    environment: "jsdom",
  },
});
