/**
 * Light or dark, and the colour scheme. Both are attributes on <html> that styles/tokens.css reads: `data-theme`
 * and `data-color-scheme`, the latter absent for the default scheme. `themeScript` applies both from local storage
 * before first paint (the `appearance` Vite plugin injects it), so nobody sees a flash of the wrong colours.
 */

export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";

/** The schemes, in the order the scheme picker shows them; styles/tokens.css defines the same ones. */
export const colorSchemes = [
  "stacks",
  "oxblood",
  "ink",
  "walnut",
  "graphite",
] as const;
export type ColorScheme = (typeof colorSchemes)[number];
export const defaultColorScheme: ColorScheme = "stacks";

export const darkSchemeQuery = "(prefers-color-scheme: dark)";

/** Where an app keeps its appearance in local storage. Give each app its own prefix. */
export type AppearanceKeys = { theme: string; colorScheme: string };

export const defaultStorageKey = "ui";

export function appearanceKeys(prefix = defaultStorageKey): AppearanceKeys {
  return {
    // Only an explicit pick is stored; until then the OS setting is followed.
    theme: `${prefix}-theme-preference`,
    colorScheme: `${prefix}-color-scheme`,
  };
}

export function isColorScheme(value: unknown): value is ColorScheme {
  return (colorSchemes as readonly unknown[]).includes(value);
}

/** What a stored value means here: a scheme this build knows, else the default. */
export function toColorScheme(value: unknown): ColorScheme {
  return isColorScheme(value) ? value : defaultColorScheme;
}

export function getStoredTheme(keys = appearanceKeys()): Theme | null {
  try {
    const stored = window.localStorage.getItem(keys.theme);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

export function storeTheme(theme: Theme | null, keys = appearanceKeys()) {
  try {
    if (theme) window.localStorage.setItem(keys.theme, theme);
    else window.localStorage.removeItem(keys.theme);
  } catch {
    // Storage may be unavailable (private mode); the choice still holds for this page.
  }
}

export function getSystemTheme(): Theme {
  return window.matchMedia(darkSchemeQuery).matches ? "dark" : "light";
}

export function getStoredColorScheme(keys = appearanceKeys()): ColorScheme {
  try {
    return toColorScheme(window.localStorage.getItem(keys.colorScheme));
  } catch {
    return defaultColorScheme;
  }
}

export function storeColorScheme(scheme: ColorScheme, keys = appearanceKeys()) {
  try {
    if (scheme === defaultColorScheme) {
      window.localStorage.removeItem(keys.colorScheme);
    } else {
      window.localStorage.setItem(keys.colorScheme, scheme);
    }
  } catch {
    // As above.
  }
}

export function applyColorScheme(scheme: ColorScheme) {
  if (scheme === defaultColorScheme) {
    delete document.documentElement.dataset.colorScheme;
  } else {
    document.documentElement.dataset.colorScheme = scheme;
  }
}

/**
 * The inline script that applies the stored theme and scheme before first paint. It is built from the same keys
 * and scheme list as the provider, so the two can't drift apart.
 */
export function themeScript(prefix = defaultStorageKey): string {
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
