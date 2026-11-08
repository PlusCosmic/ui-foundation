// Plain JavaScript (typed by vite.d.ts): Vite loads its config's plugins with Node, which won't strip TypeScript
// types from files under node_modules.
import { defaultStorageKey, themeScript } from "./theme/schemes.js";

/**
 * Puts the first-paint appearance script at the top of index.html's <head>, so the stored theme and colour scheme
 * are on <html> before anything is drawn. Give it the same `storageKey` as `AppearanceProvider`.
 *
 * @param {{ storageKey?: string }} [options]
 * @returns {import("vite").Plugin}
 */
export function appearance({ storageKey = defaultStorageKey } = {}) {
  return {
    name: "pluscosmic-ui-appearance",
    transformIndexHtml() {
      return [
        {
          tag: "script",
          children: themeScript(storageKey),
          injectTo: "head-prepend",
        },
      ];
    },
  };
}
