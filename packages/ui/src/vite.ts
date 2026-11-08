import type { Plugin } from "vite";
import { defaultStorageKey, themeScript } from "./theme/appearance.ts";

/**
 * Puts the first-paint appearance script at the top of index.html's <head>, so the stored theme and colour scheme
 * are on <html> before anything is drawn. Give it the same `storageKey` as `AppearanceProvider`.
 */
export function appearance({
  storageKey = defaultStorageKey,
}: { storageKey?: string } = {}): Plugin {
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
