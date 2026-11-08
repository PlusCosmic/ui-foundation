import { useId, useState } from "react";
import { useUiCopy } from "../copy/UiCopyProvider";
import { useAppearance } from "../theme/AppearanceProvider";
import {
  type ColorScheme,
  type ThemePreference,
  colorSchemes,
} from "../theme/appearance";
import { Notice } from "./Notice";
import { SegmentedControl } from "./SegmentedControl";

const themePreferences: ThemePreference[] = ["light", "dark", "system"];

/**
 * Light, dark or the OS's setting, and a card per colour scheme. Each card's preview carries its own
 * `data-color-scheme`, so it shows that scheme whatever is in use. Both are kept on this browser; to keep the scheme
 * on an account too, pass `onColorSchemeChange`, and if it fails the scheme goes back and the failure is shown.
 */
export function AppearanceSettings({
  onColorSchemeChange,
  errorMessage,
}: {
  onColorSchemeChange?: (scheme: ColorScheme) => void | Promise<void>;
  /** Words for a failed `onColorSchemeChange`, such as the API's message. */
  errorMessage?: (error: unknown) => string | undefined;
}) {
  const copy = useUiCopy().appearance;
  const themeLabelId = useId();
  const groupName = useId();
  const {
    theme,
    themePreference,
    setThemePreference,
    colorScheme,
    setColorScheme,
  } = useAppearance();
  const [error, setError] = useState<string | null>(null);

  const choose = async (scheme: ColorScheme) => {
    if (scheme === colorScheme) return;
    const previous = colorScheme;
    setError(null);
    setColorScheme(scheme);
    if (!onColorSchemeChange) return;
    try {
      await onColorSchemeChange(scheme);
    } catch (failure) {
      setColorScheme(previous);
      setError(errorMessage?.(failure) ?? copy.colorScheme.saveFailed);
    }
  };

  return (
    <div className="ui-appearance">
      <div className="ui-appearance-field">
        <span className="ui-appearance-label" id={themeLabelId}>
          {copy.theme.label}
        </span>
        <SegmentedControl
          aria-labelledby={themeLabelId}
          options={themePreferences.map((preference) => ({
            value: preference,
            label: copy.theme[preference],
          }))}
          value={themePreference}
          onChange={setThemePreference}
        />
      </div>
      <fieldset className="ui-appearance-field">
        <legend className="ui-appearance-label">
          {copy.colorScheme.label}
        </legend>
        <div className="ui-scheme-options">
          {colorSchemes.map((scheme) => {
            const words = copy.colorScheme.schemes[scheme];
            return (
              <label
                key={scheme}
                className="ui-scheme-option"
                data-chosen={scheme === colorScheme || undefined}
              >
                <input
                  type="radio"
                  name={groupName}
                  value={scheme}
                  checked={scheme === colorScheme}
                  onChange={() => void choose(scheme)}
                />
                <SchemePreview scheme={scheme} theme={theme} />
                <span className="ui-scheme-name">{words.name}</span>
                <span className="ui-scheme-description">
                  {words.description}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
      {error ? (
        <Notice compact tone="error">
          {error}
        </Notice>
      ) : null}
    </div>
  );
}

/** A tiny page in a scheme: a card of text lines on its background, an accent mark and a filled button. */
export function SchemePreview({
  scheme,
  theme,
}: {
  scheme: ColorScheme;
  theme: "light" | "dark";
}) {
  return (
    <span
      className="ui-scheme-preview"
      data-color-scheme={scheme}
      data-theme={theme}
      aria-hidden="true"
    >
      <span className="ui-scheme-preview-card">
        <span className="ui-scheme-preview-line" />
        <span className="ui-scheme-preview-line soft" />
        <span className="ui-scheme-preview-line soft short" />
      </span>
      <span className="ui-scheme-preview-ui">
        <span className="ui-scheme-preview-accent" />
        <span className="ui-scheme-preview-fill" />
      </span>
    </span>
  );
}
