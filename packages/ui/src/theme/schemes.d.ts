export declare const colorSchemes: readonly [
  "stacks",
  "oxblood",
  "ink",
  "walnut",
  "graphite",
];
export type ColorScheme = (typeof colorSchemes)[number];
export declare const defaultColorScheme: "stacks";
export declare const darkSchemeQuery: string;
export declare const defaultStorageKey: string;
/** Where an app keeps its appearance in local storage. */
export type AppearanceKeys = { theme: string; colorScheme: string };
export declare function appearanceKeys(prefix?: string): AppearanceKeys;
/** The inline script that applies the stored theme and scheme before first paint. */
export declare function themeScript(prefix?: string): string;
