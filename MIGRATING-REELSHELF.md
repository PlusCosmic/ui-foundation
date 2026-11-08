# Stage 2: moving Reelshelf onto the foundation

Reelshelf still has its own copy of everything here. Moving it onto `@pluscosmic/ui` keeps the two from drifting.
The steps are small enough to go one PR each, every one leaving Reelshelf looking the same.

## What maps to what

| Reelshelf                                                                         | Foundation                                                                                          |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Scheme blocks at the top of `styles/reelshelf.css`                                | `styles/tokens.css` (same token names, so `var(--…)` uses don't change)                             |
| `--processing`                                                                    | `--info`                                                                                            |
| `--case-*`, `--plank-*`, `--empty-cloth`, `--twitch`, `--logo-*`, `--spine-dot-*` | Stay in Reelshelf, in its own blocks under the same selectors                                       |
| `shared/theme/appearance.ts`, `AppearanceProvider.tsx`                            | `theme/` (`storageKey="reelshelf"` keeps the existing local storage keys)                           |
| `index.html`'s first-paint script                                                 | The `appearance({ storageKey: "reelshelf" })` Vite plugin                                           |
| `components/ui/*` (`rs-ui-*`)                                                     | Same components (`ui-*`); `Field` is now a `<label>` with `hint` and `error`                        |
| `Dialog` (`rs-modal*`), `rs-modal-panel`, `rs-modal-actions`                      | `Dialog`, `DialogBody`, `DialogActions`                                                             |
| `Chip`, `SearchBox`, `Avatar` (`primitives/`)                                     | Same names                                                                                          |
| `rs-plan-alert` (four tones), `rs-linked-notice`                                  | `Notice`, `Notice compact`                                                                          |
| `rs-plan-interval` / `rs-plan-segment`                                            | `SegmentedControl`                                                                                  |
| `BinToast`'s note (`rs-bin-toast*`)                                               | `ToastProvider`/`useToast`; `BinProvider` keeps the undo logic and Ctrl+Z                           |
| `AppShell`'s topbar, nav and profile menu (`rs-topbar`, `rs-nav`, …)              | `AppShell`, `Nav`, `ProfileMenu`, `MenuItem`, `ThemeMenuItem`                                       |
| `--rs-topbar-height`                                                              | `--ui-topbar-height`                                                                                |
| `AppearanceSettings` (bookshelf previews)                                         | `AppearanceSettings` with `onColorSchemeChange` saving to the account, or keep Reelshelf's previews |
| `uiCopy`, parts of `commonCopy`, `shellCopy`, `settingsCopy.appearance`           | `defaultUiCopy`, overridden with `UiCopyProvider` where Reelshelf's words differ                    |
| `eslint-rules/no-jsx-copy.js`                                                     | `@pluscosmic/ui/eslint`                                                                             |
| `rs-primary`, `rs-secondary`, `rs-small-button`, `rs-icon-button`                 | `Button` variants and sizes, `IconButton` (or `buttonClass(...)` on links)                          |

## Order

1. Publish the package (from this repo by git tag, or to GitHub Packages) and add it to `frontend/package.json`.
2. Tokens and theme: import `tokens.css` before `reelshelf.css`, delete the moved blocks from `reelshelf.css`,
   switch to the provider and the Vite plugin. `appearance.test.ts`'s parity check moves with the tokens; Reelshelf
   keeps one for its own extra tokens.
3. `components/ui/*`: import from the package, rename `rs-ui-` overrides in `reelshelf.css` to `ui-`.
4. Dialog, notices, segmented control, toast: one component per PR, since each has many call sites.
5. Shell and appearance settings.
6. Lint rule, then delete what's left of the old copies.

Each step is checked against screenshots of the same pages in all five schemes, light and dark.
