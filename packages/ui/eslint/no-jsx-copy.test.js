import { RuleTester } from "eslint";
import tseslint from "typescript-eslint";
import { describe, it } from "vitest";
import { noJsxCopy } from "./index.js";

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

tester.run("no-jsx-copy", noJsxCopy, {
  valid: [
    "<p>{copy.title}</p>",
    "<p>{count} · {total}</p>",
    '<div className="ui-thing" />',
    "<button aria-label={copy.close} />",
    '<input type="search" />',
  ],
  invalid: [
    { code: "<p>Hello there</p>", errors: [{ messageId: "text" }] },
    { code: '<p>{"Hello"}</p>', errors: [{ messageId: "text" }] },
    {
      code: "<p>{busy ? `Saving` : copy.save}</p>",
      errors: [{ messageId: "text" }],
    },
    {
      code: '<button aria-label="Close" />',
      errors: [{ messageId: "attribute" }],
    },
    {
      code: '<input placeholder="Search" />',
      options: [{ copyDir: "app/words/" }],
      errors: [
        {
          message: "Move the `placeholder` copy into app/words/ and import it.",
        },
      ],
    },
  ],
});
