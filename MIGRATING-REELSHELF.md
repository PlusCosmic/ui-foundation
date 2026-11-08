# Moving Reelshelf onto the foundation

Reelshelf runs on `@pluscosmic/ui` from 0.1.3. It went over in five PRs, each checked against Reelshelf's own
markup and CSS (computed styles and boxes, light and dark) so it looked the same, with the package fixed in a patch
release wherever it drifted. The table records what each Reelshelf piece became, which is also the guide for an
app moving off its own copy.

## What maps to what

| Reelshelf                                                                         | Foundation                                                                                     |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Scheme blocks at the top of `styles/reelshelf.css`                                | `styles/tokens.css` (same token names, so `var(--…)` uses don't change)                        |
| `--processing`                                                                    | `--info`                                                                                       |
| `--case-*`, `--plank-*`, `--empty-cloth`, `--twitch`, `--logo-*`, `--spine-dot-*` | Stay in Reelshelf, in its own blocks under the same selectors                                  |
| `shared/theme/appearance.ts`, `AppearanceProvider.tsx`                            | `theme/` (`storageKey="reelshelf"` keeps the existing local storage keys)                      |
| `index.html`'s first-paint script                                                 | The `appearance({ storageKey: "reelshelf" })` Vite plugin                                      |
| `components/ui/*` (`rs-ui-*`)                                                     | Same components (`ui-*`); `Field` is now a `<label>` with `hint` and `error`                   |
| `Dialog` (`rs-modal*`), `rs-modal-panel`, `rs-modal-actions`                      | `Dialog`, `DialogBody`, `DialogActions`                                                        |
| `Chip`, `SearchBox`, `Avatar` (`primitives/`)                                     | Same names                                                                                     |
| `rs-plan-alert` (four tones), `rs-linked-notice`                                  | `Notice`, `Notice compact`                                                                     |
| `rs-plan-interval` / `rs-plan-segment`                                            | `SegmentedControl`                                                                             |
| `BinToast`'s note (`rs-bin-toast*`)                                               | `ToastLayer`, `ToastCard`, `ToastButton`; `BinProvider` keeps the undo logic and Ctrl+Z        |
| `AppShell`'s topbar, nav and profile menu (`rs-topbar`, `rs-nav`, …)              | `AppShell`, `Nav`, `ProfileMenu`, `MenuItem`, `ThemeMenuItem`                                  |
| `--rs-topbar-height`                                                              | `--ui-topbar-height`                                                                           |
| `AppearanceSettings` (bookshelf previews)                                         | Kept, with `SegmentedControl` for the theme; `AppearanceSettings` is for apps without previews |
| `uiCopy`, parts of `commonCopy`, `shellCopy`, `settingsCopy.appearance`           | `defaultUiCopy`, overridden with `UiCopyProvider` where Reelshelf's words differ               |
| `eslint-rules/no-jsx-copy.js`                                                     | `@pluscosmic/ui/eslint`                                                                        |
| `rs-primary`, `rs-secondary`, `rs-small-button`, `rs-icon-button`                 | `Button` variants and sizes, `IconButton` (or `buttonClass(...)` on links)                     |

## What stayed in Reelshelf

- Its own tokens (the bookcase, the logo, Twitch's purple) and every page's layout.
- The raw button classes on links and spans (`rs-primary`, `rs-secondary`, `rs-small-button`, `rs-icon-button`),
  `rs-eyebrow`, `rs-spinner`, `rs-empty` and `rs-visually-hidden`, used in too many places to be worth a move.
- What goes inside a dialog (`rs-modal-panel` and the rest).
- The appearance settings' bookshelf previews.
