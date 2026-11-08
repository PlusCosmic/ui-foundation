/**
 * Keeps user-facing copy in one folder (`src/copy/` unless the `copyDir` option names another): reports words
 * written straight into JSX,
 * whether as text, a string or template in `{...}`, or a string given to an attribute people read
 * (`aria-label`, `title`, `placeholder` and the like). Text without letters (punctuation, numbers, `·`) is
 * allowed, and so are attributes that aren't read, such as `className` or `type`.
 */
const hasLetter = (text) => /\p{L}/u.test(text);

const defaultAttributes = [
  "alt",
  "aria-description",
  "aria-label",
  "aria-placeholder",
  "aria-roledescription",
  "aria-valuetext",
  "description",
  "label",
  "placeholder",
  "title",
];

/** The string literals and templates an expression can evaluate to directly. */
function* literalsIn(node) {
  if (!node) return;
  switch (node.type) {
    case "Literal":
      if (typeof node.value === "string" && hasLetter(node.value)) yield node;
      break;
    case "TemplateLiteral":
      if (node.quasis.some((quasi) => hasLetter(quasi.value.cooked ?? "")))
        yield node;
      break;
    case "ConditionalExpression":
      yield* literalsIn(node.consequent);
      yield* literalsIn(node.alternate);
      break;
    case "LogicalExpression":
      yield* literalsIn(node.left);
      yield* literalsIn(node.right);
      break;
    case "TSAsExpression":
    case "TSSatisfiesExpression":
      yield* literalsIn(node.expression);
      break;
  }
}

export const noJsxCopy = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow user-facing copy written directly in JSX",
    },
    schema: [
      {
        type: "object",
        properties: {
          attributes: { type: "array", items: { type: "string" } },
          copyDir: { type: "string" },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      text: "Move this copy into {{copyDir}} and import it.",
      attribute: "Move the `{{name}}` copy into {{copyDir}} and import it.",
    },
  },
  create(context) {
    const attributes = new Set(
      context.options[0]?.attributes ?? defaultAttributes,
    );
    const copyDir = context.options[0]?.copyDir ?? "src/copy/";
    const isChild = (node) =>
      node.parent?.type === "JSXElement" || node.parent?.type === "JSXFragment";

    return {
      JSXText(node) {
        if (hasLetter(node.value))
          context.report({ node, messageId: "text", data: { copyDir } });
      },
      JSXExpressionContainer(node) {
        if (!isChild(node)) return;
        for (const literal of literalsIn(node.expression))
          context.report({
            node: literal,
            messageId: "text",
            data: { copyDir },
          });
      },
      JSXAttribute(node) {
        if (node.name.type !== "JSXIdentifier") return;
        const name = node.name.name;
        if (!attributes.has(name) || !node.value) return;
        const value =
          node.value.type === "JSXExpressionContainer"
            ? node.value.expression
            : node.value;
        for (const literal of literalsIn(value))
          context.report({
            node: literal,
            messageId: "attribute",
            data: { name, copyDir },
          });
      },
    };
  },
};

/** The plugin: `plugins: { ui: uiPlugin }`, then `"ui/no-jsx-copy": "error"`. */
const uiPlugin = { rules: { "no-jsx-copy": noJsxCopy } };

export default uiPlugin;
