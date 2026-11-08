import type { Plugin } from "vite";

/**
 * Puts the first-paint appearance script at the top of index.html's <head>. Give it the same `storageKey` as
 * `AppearanceProvider`.
 */
export declare function appearance(options?: { storageKey?: string }): Plugin;
