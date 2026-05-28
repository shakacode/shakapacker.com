import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(new URL("../prototypes/docusaurus/src/css/custom.css", import.meta.url), "utf8");

function declarationsFor(selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escapedSelector}\\s*\\{(?<body>[^}]+)\\}`));

  assert.ok(match, `Expected ${selector} to exist`);

  return Object.fromEntries(
    match.groups.body
      .split(";")
      .map((declaration) => declaration.trim())
      .filter(Boolean)
      .map((declaration) => {
        const [property, ...value] = declaration.split(":");
        return [property.trim(), value.join(":").trim()];
      })
  );
}

test("markdown h4 and h5 are styled as visible changelog section headings", () => {
  assert.deepEqual(declarationsFor(".markdown h4"), {
    "margin-top": "1.35rem",
    "margin-bottom": "0.55rem",
    "font-size": "1.12rem",
    "font-weight": "700",
    "line-height": "1.35",
    color: "var(--ifm-color-content)"
  });

  assert.deepEqual(declarationsFor(".markdown h5"), {
    "margin-top": "1.1rem",
    "margin-bottom": "0.45rem",
    "font-size": "1.02rem",
    "font-weight": "700",
    "line-height": "1.35",
    color: "var(--ifm-color-content)"
  });
});

test("markdown inline code uses a subtle borderless chip style", () => {
  const declarations = declarationsFor(".markdown code");

  assert.equal(declarations.background, "var(--site-surface-1)");
  assert.equal(declarations.border, "0");
  assert.equal(declarations["border-radius"], "4px");
  assert.equal(declarations.padding, "0.12em 0.28em");
  assert.equal(declarations["font-family"], "var(--ifm-font-family-monospace)");
  assert.equal(declarations.color, "var(--ifm-color-content)");
});
