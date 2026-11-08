# Foundation

The UI foundation pulled out of Reelshelf: its colour schemes in light and dark, its type, and the components and
app chrome built on them, under neutral names so any project can start from it.

- `packages/ui` — `@pluscosmic/ui`, the package apps depend on.
- `apps/playground` — every component in every scheme, and a template for a new app's wiring.

```bash
bun install
```

```bash
bun run dev
```

```bash
bun run check
```

`check` runs build → typecheck → lint → test → format check.

## What's in it

| Area       | What                                                                                                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tokens     | `styles/tokens.css`: Stacks (default), Oxblood, Ink, Walnut and Graphite, each light and dark, as CSS custom properties (`--bg`, `--fg`, `--accent`, `--fill`, …)      |
| Type       | Instrument Sans for text, Fraunces for display (`.ui-display`, `PageHeader`, `Wordmark`), from `fonts.css`                                                             |
| Theme      | `AppearanceProvider`/`useAppearance` (light, dark or follow the OS; the scheme), the `appearance` Vite plugin (applies both before first paint), `AppearanceSettings`  |
| Controls   | `Button`, `IconButton`, `Input`, `Textarea`, `Checkbox`, `Field`, `Select`, `SearchBox`, `Chip`/`ChipRow`, `Badge`, `SegmentedControl`                                 |
| Messages   | `Notice` (four tones, full or compact), `Dialog`/`DialogBody`/`DialogActions`, `ToastProvider`/`useToast`                                                              |
| Layout     | `AppShell` (sticky top bar, nav strip on phones), `Nav`, `Wordmark`, `ProfileMenu`, `MenuItem`, `ThemeMenuItem`, `PageHeader`, `SettingsSection`, `EmptyState`         |
| Odds, ends | `Avatar`, `Spinner`, `Kbd`, `Eyebrow`, `VisuallyHidden`, `LoadMore` + `useInfiniteScroll` (fits any TanStack infinite query), `cx`                                     |
| Copy       | Every word the components show is in `copy/ui.ts` and replaceable through `UiCopyProvider`; the `ui/no-jsx-copy` lint rule keeps an app's own words in its `src/copy/` |

## Starting an app on it

1. Depend on a release's tarball: each `ui-v<version>` tag publishes one as a GitHub release asset, so
   `"@pluscosmic/ui": "https://github.com/PlusCosmic/ui-foundation/releases/download/ui-v0.1.0/pluscosmic-ui-0.1.0.tgz"`.
   It ships TypeScript source, so the app needs a bundler that compiles dependencies (Vite does).
2. `vite.config.ts`: `plugins: [react(), appearance({ storageKey: "myapp" })]` from `@pluscosmic/ui/vite`.
3. Entry: import `@pluscosmic/ui/fonts.css` and `@pluscosmic/ui/styles.css`, then wrap the app in
   `<AppearanceProvider storageKey="myapp">` and `<ToastProvider>`.
4. Chrome: `<AppShell brand={…} nav={<Nav>{router links}</Nav>} actions={<ProfileMenu …/>}>`. Router links that set
   `aria-current="page"` (TanStack Router's and React Router's do) are marked as the current page.
5. Lint: add the plugin from `@pluscosmic/ui/eslint` as in this repo's `eslint.config.js`, and keep the app's words
   in `src/copy/` as `packages/ui/COPY.md` describes.

The playground (`apps/playground/src/main.tsx`, `App.tsx`) is all of this in about 100 lines.

## Changing the look

- **A token's value**: edit it in every scheme's light and dark block of `tokens.css`. The test in
  `theme/appearance.test.ts` fails if a scheme misses a token the default has.
- **A new scheme**: add its name to `colorSchemes` in `theme/schemes.js`, its two blocks to `tokens.css` and its
  words to `copy/ui.ts`. The first-paint script picks it up from the list.
- **An app's own tokens** (say, a chart palette): define them in the app's CSS under the same selectors, beside the
  foundation's.
- **Class names** all start `ui-`. App styles that only adjust a component (`.my-toolbar .ui-button`) sit in the app.

## Rune

`rune/` carries the same look to native apps built with Rune: a `rune-kit` theme crate whose colours are generated
from `tokens.css`, and a gallery. See `rune/README.md`.

## Releasing

Bump `version` in `packages/ui/package.json` in a PR, merge it, then tag `main` with `ui-v<that version>` and push
the tag. `.github/workflows/release-ui.yml` checks the tag matches the version, runs the checks and the package
check, packs `packages/ui` and publishes the tarball as the release's asset. Apps move to it by changing the version
in their dependency's URL.
