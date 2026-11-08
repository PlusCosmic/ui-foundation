import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  appearanceKeys,
  applyColorScheme,
  colorSchemes,
  getStoredColorScheme,
  storeColorScheme,
  themeScript,
  toColorScheme,
} from "./appearance";

const css = readFileSync(resolve(__dirname, "../styles/tokens.css"), "utf8");

/** The custom properties set in the block `selector` opens. */
function tokensOf(selector: string): string[] {
  const start = css.indexOf(`${selector} {`);
  expect(start, `tokens.css has a ${selector} block`).toBeGreaterThan(-1);
  const body = css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
  return [...body.matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1]);
}

afterEach(() => {
  window.localStorage.clear();
  delete document.documentElement.dataset.colorScheme;
  delete document.documentElement.dataset.theme;
});

describe("colour schemes", () => {
  it("keeps the default off the root element and the others on it", () => {
    applyColorScheme("ink");
    expect(document.documentElement.dataset.colorScheme).toBe("ink");
    applyColorScheme("stacks");
    expect(document.documentElement.dataset.colorScheme).toBeUndefined();
  });

  it("remembers a scheme on this browser and forgets the default", () => {
    const keys = appearanceKeys("test");
    storeColorScheme("walnut", keys);
    expect(getStoredColorScheme(keys)).toBe("walnut");
    storeColorScheme("stacks", keys);
    expect(window.localStorage.getItem(keys.colorScheme)).toBeNull();
  });

  it("reads anything it doesn't know as the default", () => {
    const keys = appearanceKeys();
    window.localStorage.setItem(keys.colorScheme, "green");
    expect(getStoredColorScheme(keys)).toBe("stacks");
    expect(toColorScheme(undefined)).toBe("stacks");
    expect(toColorScheme("graphite")).toBe("graphite");
  });

  it("defines every scheme's light and dark tokens, as many as the default has", () => {
    const stacks = tokensOf(
      '[data-color-scheme="stacks"]:not([data-theme="dark"])',
    );
    // Danger and warning are shared, so a scheme may leave them to the default.
    const shared = ["--danger", "--warning"];
    for (const scheme of colorSchemes) {
      for (const mode of [':not([data-theme="dark"])', '[data-theme="dark"]']) {
        const tokens = tokensOf(`[data-color-scheme="${scheme}"]${mode}`);
        expect(
          tokens.filter((token) => !shared.includes(token)).sort(),
        ).toEqual(stacks.filter((token) => !shared.includes(token)).sort());
      }
    }
  });
});

describe("the first-paint script", () => {
  const run = (prefix: string) => new Function(themeScript(prefix))();

  it("applies a stored theme and scheme under its own keys", () => {
    window.localStorage.setItem("app-theme-preference", "dark");
    window.localStorage.setItem("app-color-scheme", "oxblood");
    run("app");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.dataset.colorScheme).toBe("oxblood");
  });

  it("follows the OS without a stored theme and ignores unknown schemes", () => {
    window.matchMedia = ((query: string) => ({
      matches: query.includes("dark"),
    })) as typeof window.matchMedia;
    window.localStorage.setItem("app-color-scheme", "green");
    run("app");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.dataset.colorScheme).toBeUndefined();
  });

  it("names every scheme but the default", () => {
    for (const scheme of colorSchemes.filter((name) => name !== "stacks")) {
      expect(themeScript()).toContain(`"${scheme}"`);
    }
  });
});
