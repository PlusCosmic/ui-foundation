import type { ColorScheme, Theme } from "../theme/appearance";

/**
 * Every word the foundation's components show. An app replaces any of them, or translates them, by giving
 * `UiCopyProvider` its own; anything it leaves out keeps these.
 */
export const defaultUiCopy = {
  close: "Close",
  tryAgain: "Try again",
  selectPlaceholder: "Choose…",
  searchPlaceholder: "Search…",
  avatar: {
    defaultName: "You",
    defaultInitial: "Y",
    alt: "Profile picture",
  },
  loadMore: {
    /** `noun` is the plural noun for the items, as in "Load more posts". */
    failed: (noun: string) => `More ${noun} didn't load.`,
    button: (noun: string) => `Load more ${noun}`,
    loading: (noun: string) => `Loading more ${noun}…`,
  },
  toast: {
    dismiss: "Dismiss",
  },
  shell: {
    navLabel: "Primary",
    profileMenu: "Account menu",
    /** The menu item that switches theme, named after the theme it switches to. */
    themeToggle: (current: Theme) =>
      current === "dark" ? "Light mode" : "Dark mode",
  },
  appearance: {
    theme: {
      label: "Theme",
      light: "Light",
      dark: "Dark",
      system: "Match system",
    },
    colorScheme: {
      label: "Colour scheme",
      saveFailed: "Your colour scheme didn't save. Try again.",
      schemes: {
        stacks: { name: "Stacks", description: "Green, and the default." },
        oxblood: {
          name: "Oxblood",
          description: "Red-brown leather and wine, like an old reading room.",
        },
        ink: { name: "Ink", description: "Blue-black ink and cool slate." },
        walnut: { name: "Walnut", description: "Dark wood and brass." },
        graphite: {
          name: "Graphite",
          description: "No tint, so your content carries the colour.",
        },
      } satisfies Record<ColorScheme, { name: string; description: string }>,
    },
  },
};

export type UiCopy = typeof defaultUiCopy;

/** A partial `UiCopy`: any entry, at any depth, may be left out. */
export type UiCopyOverrides = {
  [K in keyof UiCopy]?: UiCopy[K] extends (...args: never[]) => unknown
    ? UiCopy[K]
    : UiCopy[K] extends object
      ? DeepPartial<UiCopy[K]>
      : UiCopy[K];
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends (...args: never[]) => unknown
    ? T[K]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** `base` with every entry `overrides` gives replaced, nested objects merged rather than swapped whole. */
export function mergeCopy<T>(base: T, overrides: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(overrides)) {
    return (overrides ?? base) as T;
  }
  const merged: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) continue;
    merged[key] = mergeCopy((base as Record<string, unknown>)[key], value);
  }
  return merged as T;
}
