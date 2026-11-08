// The scheme list, the storage keys and the first-paint script, in plain JavaScript (typed by schemes.d.ts) so the
// `appearance` Vite plugin can load them from node_modules, where Node won't strip TypeScript types.

/** The schemes, in the order the scheme picker shows them; styles/tokens.css defines the same ones. */
export const colorSchemes = ["stacks", "oxblood", "ink", "walnut", "graphite"];

export const defaultColorScheme = "stacks";

export const darkSchemeQuery = "(prefers-color-scheme: dark)";

export const defaultStorageKey = "ui";

/** Where an app keeps its appearance in local storage. Give each app its own prefix. */
export function appearanceKeys(prefix = defaultStorageKey) {
  return {
    // Only an explicit pick is stored; until then the OS setting is followed.
    theme: `${prefix}-theme-preference`,
    colorScheme: `${prefix}-color-scheme`,
  };
}

/**
 * The inline script that applies the stored theme and scheme before first paint. It is built from the same keys
 * and scheme list as the provider, so the two can't drift apart.
 */
export function themeScript(prefix = defaultStorageKey) {
  const keys = appearanceKeys(prefix);
  const others = colorSchemes.filter((scheme) => scheme !== defaultColorScheme);
  return [
    "try {",
    `  var theme = localStorage.getItem(${JSON.stringify(keys.theme)});`,
    '  if (theme !== "light" && theme !== "dark") {',
    `    theme = matchMedia(${JSON.stringify(darkSchemeQuery)}).matches ? "dark" : "light";`,
    "  }",
    "  document.documentElement.dataset.theme = theme;",
    `  var scheme = localStorage.getItem(${JSON.stringify(keys.colorScheme)});`,
    `  if (${JSON.stringify(others)}.indexOf(scheme) !== -1) {`,
    "    document.documentElement.dataset.colorScheme = scheme;",
    "  }",
    "} catch (error) {}",
  ].join("\n");
}
