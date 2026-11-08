import { describe, expect, it } from "vitest";
import { defaultUiCopy, mergeCopy } from "./ui";

describe("mergeCopy", () => {
  it("replaces what it's given and keeps the rest, at any depth", () => {
    const merged = mergeCopy(defaultUiCopy, {
      close: "Fermer",
      appearance: { theme: { dark: "Sombre" } },
    });
    expect(merged.close).toBe("Fermer");
    expect(merged.appearance.theme.dark).toBe("Sombre");
    expect(merged.appearance.theme.light).toBe("Light");
    expect(merged.tryAgain).toBe("Try again");
  });

  it("takes functions whole", () => {
    const merged = mergeCopy(defaultUiCopy, {
      loadMore: { button: (noun: string) => `More ${noun}` },
    });
    expect(merged.loadMore.button("posts")).toBe("More posts");
    expect(merged.loadMore.failed("posts")).toBe("More posts didn't load.");
  });
});
