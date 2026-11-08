# AGENTS.md

The UI foundation pulled out of Reelshelf: its colour schemes in light and dark, its type, and the components and
app chrome built on them, for the web (`@pluscosmic/ui`) and for native Rune apps (`rune-theme-foundation`). Both
read the same tokens.

## Repo shape

- `packages/ui/` — `@pluscosmic/ui`, React 19, shipped as TypeScript source (consumers need a bundler such as Vite).
  - `src/styles/tokens.css` is the **one source of colour**: Stacks (default, on `:root`), Oxblood, Ink, Walnut,
    Graphite, each a light and a dark block under `data-color-scheme` / `data-theme` on `<html>`.
  - `src/styles/base.css`, `components.css`: every class starts `ui-`. Token names are unprefixed (`--bg`, `--fg`,
    `--accent`, `--fill`, …) and match Reelshelf's, so its `var(--…)` uses carry over unchanged.
  - `src/theme/`: `appearance.ts` (scheme list, storage keys, `themeScript`), `AppearanceProvider`.
  - `src/vite.ts`: the `appearance` Vite plugin, which injects the first-paint script. It runs in Vite's config
    loader under Node's type stripping, so it imports with explicit `.ts` extensions and uses erasable syntax only.
  - `src/copy/ui.ts`: every word the components show, overridable through `UiCopyProvider`.
  - `eslint/index.js`: the `ui/no-jsx-copy` rule (tests in `no-jsx-copy.test.js`).
- `apps/playground/` — every component in every scheme; also the template for a new app's wiring.
- `rune/` — a separate Cargo workspace (toolchain pinned in `rune/rust-toolchain.toml`; `rune` and `rune-kit` pinned
  to one `dev` revision of https://github.com/anomalyco/rune, the same one Reelshelf's desktop app uses).
  - `theme/` (`rune-theme-foundation`): `assets/schemes/<scheme>.json` is **generated** from `tokens.css` by
    `theme/tools/theme.mjs` (Chromium resolves `oklch()`/`color-mix()`); never hand-edit it. `src/lib.rs` maps the
    tokens onto `rune-kit`'s `Kit`; `src/parts.rs` has the pieces `rune-kit` lacks (Notice, chip, avatar, …).
  - `gallery/` (`foundation-gallery`): the playground in Rune, one `--scene` per scheme and appearance.
- `MIGRATING-REELSHELF.md` — the plan for moving Reelshelf onto the package.

## Commands

- `bun install`, then `bun run check` (build → typecheck → lint → test → format check). `bun run dev` serves the
  playground.
- `bun run generate:rune-theme` after any change to `tokens.css`; `bun run check:rune-theme` fails when the Rune
  schemes are stale. Both need Playwright's Chromium (`bunx playwright install chromium`).
- In `rune/`: `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, `cargo test`, and
  `scripts/render.sh [dir]` to render the gallery headless. On Linux Rune needs `libxkbcommon-dev libwayland-dev
libxkbcommon-x11-0`, and `mesa-vulkan-drivers` (lavapipe) to render without a GPU.
- CI (`.github/workflows/ci.yml`) runs all three: Web, the Rune theme check, and Rune (with the renders uploaded).

## Changing the look

- A token's value: edit every scheme's light and dark block in `tokens.css`, regenerate the Rune schemes, and look at
  the playground and the gallery renders. `theme/appearance.test.ts` fails if a scheme misses a token the default has.
- A new scheme: its name in `colorSchemes` (`appearance.ts`), two blocks in `tokens.css`, its words in `copy/ui.ts`,
  then `ColorScheme` in `rune/theme/src/lib.rs` (a test checks the two lists match) and a regenerate.
- A new web component: words in `copy/ui.ts`, styles in `components.css` under `ui-`, an export in `src/index.ts`,
  a section in the playground. If `rune-kit` has no equivalent, add one to `rune/theme/src/parts.rs` and the gallery.
- A new `rune-kit` role the theme doesn't map falls back to `Kit::from_palette_focus`; map it in `map_kit` when it
  looks wrong in the renders (the filled buttons once did).

## Conventions

- Copy: no words written straight into JSX outside `src/copy/` (the lint rule enforces it; tests are exempt). See
  `packages/ui/COPY.md`. British English, sentence case, no exclamation marks.
- Comments say why, in plain sentences. Keep the playground and gallery showing every component.
- This repository is public: commits, docs and comments give engineering reasons only.
