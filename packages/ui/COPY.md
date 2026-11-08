# Copy

Every word an app shows people lives in its `src/copy/`, so it can be read, reviewed and changed in one place
without hunting through components. The `ui/no-jsx-copy` lint rule (`eslint/index.js`) fails on words written
straight into JSX anywhere else: text, strings or templates in `{...}`, and strings given to attributes people read
(`aria-label`, `title`, `placeholder`, `alt`, `label`, `description`, ...). Tests are exempt. Text without letters
(`·`, numbers) is allowed, and so are attributes nobody reads (`className`, `type`).

The foundation follows the same rule: its components' words are in `src/copy/ui.ts`, and an app replaces any of them
(to match its voice, or to translate) with `<UiCopyProvider copy={{ close: "Fermer" }}>`.

## Layout

One module per area of the app, named after it, exporting one object named `<area>Copy` (`settingsCopy`,
`billingCopy`, ...), plus `common.ts` for words used everywhere. Import a module directly; with no index file, each
chunk only pulls in the copy of the components it uses.

## Writing entries

- **Plain text** is a string: `title: "Upload a whole night at once"`.
- **Text with values** is a function taking them: `itemsAcross: (items: number, groups: number) => ...`.
- **Emphasis** (`<em>`, `<strong>`, `<code>`) is a JSX fragment in a `.tsx` module:
  `title: <>Every piece, <em>in one place</em></>`. In the display face, `<em>` takes the accent.
- **Links or components inside a sentence** are passed in by the component, so the copy keeps the wording and the
  component keeps the routing: `agree: (terms: ReactNode) => <>By continuing you agree to the {terms}.</>`.
- **Long documents** (terms, privacy policy) stay whole, as components in their own module.
- Keep entries in the order they appear on the page, and group a page's parts in nested objects.
- Names, data and identifiers aren't copy: things from the API, CSS classes, query keys and log messages stay put.

## House style (Reelshelf's; keep, change or replace per app)

- Plain words, said once: short, active sentences that say what happened and what to do next.
- Sentence case for headings, buttons and labels. Buttons are verbs.
- Errors say what didn't happen, then what to do: "Your changes didn't save. Try again." Say "nothing changed" when
  it's true.
- Destructive actions say "permanently" and "can't be undone".
- Straight quotes in source; `·` separates facts on one line; `…` ends anything still happening ("Saving…") and a
  button that opens a further step ("Delete account…"); no exclamation marks.

Write each app's own **voice** (who it sounds like, the words it uses for its things) at the top of its
`src/copy/README.md`.
