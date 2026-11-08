/**
 * Light or dark, and the colour scheme. Both are attributes on <html> that styles/tokens.css reads: `data-theme`
 * and `data-color-scheme`, the latter absent for the default scheme. `themeScript` applies both from local storage
 * before first paint (the `appearance` Vite plugin injects it), so nobody sees a flash of the wrong colours.
 */

import {
  type AppearanceKeys,
  type ColorScheme,
  appearanceKeys,
  colorSchemes,
  darkSchemeQuery,
  defaultColorScheme,
  defaultStorageKey,
  themeScript,
} from "./schemes.js";

export {
  type AppearanceKeys,
  type ColorScheme,
  appearanceKeys,
  colorSchemes,
  darkSchemeQuery,
  defaultColorScheme,
  defaultStorageKey,
  themeScript,
};

export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";

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
