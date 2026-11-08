# Foundation for Rune

The same design language as `@pluscosmic/ui`, for native apps built with [Rune](https://github.com/anomalyco/rune).
It follows Rune's own split: `rune-kit` holds the components and reads only a `Kit` of semantic tokens, and a
**theme crate** fills that `Kit` for one brand, as `rune-theme-opencode` does for OpenCode.

- `theme/` — `rune-theme-foundation`: the five schemes as Rune theme data, the fonts, the type scale, the mapping
  onto `rune-kit`'s `Kit`, and the pieces `rune-kit` doesn't have (`parts`).
- `gallery/` — the playground's components in Rune, one scene per scheme and appearance.

```bash
cargo run -p foundation-gallery
```

```bash
cargo run -p foundation-gallery -- --snap renders/ink-dark.png --scene ink-dark
```

```bash
cargo test && cargo clippy --all-targets -- -D warnings
```

On Linux, Rune needs `libxkbcommon-dev libwayland-dev libxkbcommon-x11-0`, and `mesa-vulkan-drivers` to render
headless on the CPU.

## One source of colour

`theme/assets/schemes/<scheme>.json` is generated from the web package's `tokens.css` by a browser, which resolves
`oklch()` and `color-mix()` exactly as the web shows them:

```bash
node rune/theme/tools/theme.mjs
```

`--check` fails when the JSON is out of date; run it in CI beside `bun run check`. Change a colour in `tokens.css`,
regenerate, and both platforms follow. The crate's tests also fail if the scheme list drifts from `appearance.ts`.

## Using it

```rust
use rune_theme_foundation::{ColorScheme, FAMILIES, FONTS, look, parts::{self, Notice, Tone}};

fn view(s: &App, cx: &mut Cx<App>) -> El {
    let l = look(s.scheme, cx.system_dark());
    let k = &l.kit;
    col()
        .child(parts::page_header(l, Some("Settings"), "Appearance", None))
        .child(Button::new("Save").variant(ButtonVariant::Submit).build(k))
        .child(Notice::new(Tone::Warning).title("Nearly full").build(l))
}

// AppSpec { fonts: FONTS, families: FAMILIES, .. }
```

| Web (`@pluscosmic/ui`)                                                        | Rune                                                                                                                |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Tokens, `data-color-scheme`, `data-theme`                                     | `look(scheme, dark)`: `l.t` (tokens), `l.kit` (`rune-kit`'s Kit)                                                    |
| `AppearanceProvider`                                                          | The app's state holds a `ColorScheme`; dark is `cx.system_dark()` or the person's pick                              |
| `Button` primary / secondary / ghost / danger                                 | `rune_kit::Button` `Submit` / `Neutral` / `Ghost` / `Danger`                                                        |
| `Input`, `Textarea`, `Field`, `Checkbox`, `Select`                            | `TextInput`, `TextArea`, `Field`, `Checkbox`, `Select`                                                              |
| `SegmentedControl`, `Badge`, `Kbd`, `Spinner`                                 | `SegmentedControl`, `Badge`, `Keybind`, `Spinner`                                                                   |
| `Dialog`, `ToastProvider`                                                     | `Dialog` (into the overlay layer), `Toast` / `ToastRegion`                                                          |
| `ProfileMenu`, `MenuItem`                                                     | `Menu`                                                                                                              |
| `AppShell` (top bar)                                                          | `rune_kit::shell` (`SplitView`, `Sidebar`, `Toolbar`, `Page`): the desktop shape                                    |
| `Notice`, `Chip`, `Avatar`, `EmptyState`, `PageHeader`, `Eyebrow`, `Wordmark` | `parts::*`, drawn as `components.css` draws them                                                                    |
| `AppearanceSettings`                                                          | `SegmentedControl` + `parts::scheme_picker`                                                                         |
| `copy/` + `no-jsx-copy`                                                       | A `copy.rs` per app, checked by headless tests that every text node comes from it (as Reelshelf's desktop app does) |

## Known gaps

- Only Fraunces Medium upright is bundled, so the wordmark and display `<em>` aren't italic yet; add the static
  italic TTF to `assets/fonts/` and a `DISPLAY_ITALIC` style.
- `rune-kit`'s `Danger` button is a soft button with red text, where the web fills it red.
- The dialog's backdrop is `rune-kit`'s dark scrim, not the web's blurred veil.
- The theme maps the kit's commonest roles; anything unmapped falls back to `Kit::from_palette_focus`, derived from
  the scheme's page, text and fill. Check new components against the gallery in all ten looks.
- Reelshelf's desktop app (`desktop/app/src/theme.rs`) does the same mapping by hand for Stacks only. Moving it onto
  this crate gives it all five schemes and removes its hand-copied colours.
