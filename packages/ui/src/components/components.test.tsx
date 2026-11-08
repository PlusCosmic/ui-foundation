import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { UiCopyProvider } from "../copy/UiCopyProvider";
import { AppearanceProvider } from "../theme/AppearanceProvider";
import { AppearanceSettings } from "./AppearanceSettings";
import { Dialog } from "./Dialog";
import { Select } from "./Select";
import { ToastProvider, useToast } from "./Toast";

beforeAll(() => {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  window.localStorage.clear();
  delete document.documentElement.dataset.colorScheme;
});

describe("Dialog", () => {
  it("closes on Escape unless busy, and names itself by its title", () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Dialog title="Rename" onClose={onClose} busy>
        body
      </Dialog>,
    );
    expect(screen.getByRole("dialog", { name: "Rename" })).toBeTruthy();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
    rerender(
      <Dialog title="Rename" onClose={onClose}>
        body
      </Dialog>,
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("uses the app's words for its close button", () => {
    render(
      <UiCopyProvider copy={{ close: "Fermer" }}>
        <Dialog title="Rename" onClose={() => {}}>
          body
        </Dialog>
      </UiCopyProvider>,
    );
    expect(screen.getByRole("button", { name: "Fermer" })).toBeTruthy();
  });
});

describe("Select", () => {
  it("picks with the keyboard", () => {
    const onValueChange = vi.fn();
    render(
      <Select
        aria-label="Kind"
        value="a"
        onValueChange={onValueChange}
        options={[
          { label: "A", value: "a" },
          { label: "B", value: "b" },
        ]}
      />,
    );
    const trigger = screen.getByRole("button", { name: "Kind" });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(screen.getByRole("listbox")).toBeTruthy();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(onValueChange).toHaveBeenCalledWith("b");
  });
});

describe("Toast", () => {
  function Shower() {
    const toast = useToast();
    return (
      <button onClick={() => toast.show({ message: "Moved", duration: 1000 })}>
        show
      </button>
    );
  }

  it("goes after its time, but not while pointed at", () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <Shower />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText("show"));
    const layer = screen.getByRole("status");
    fireEvent.pointerEnter(layer);
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.queryByText("Moved")).toBeTruthy();
    fireEvent.pointerLeave(layer);
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.queryByText("Moved")).toBeNull();
  });
});

describe("AppearanceSettings", () => {
  it("puts the scheme back when saving it fails", async () => {
    const save = vi.fn().mockRejectedValue(new Error("offline"));
    render(
      <AppearanceProvider>
        <AppearanceSettings onColorSchemeChange={save} />
      </AppearanceProvider>,
    );
    await act(async () => {
      fireEvent.click(screen.getByRole("radio", { name: /Ink/ }));
    });
    expect(save).toHaveBeenCalledWith("ink");
    expect(
      (screen.getByRole("radio", { name: /Stacks/ }) as HTMLInputElement)
        .checked,
    ).toBe(true);
    expect(screen.getByRole("alert").textContent).toContain("didn't save");
    expect(document.documentElement.dataset.colorScheme).toBeUndefined();
  });
});
