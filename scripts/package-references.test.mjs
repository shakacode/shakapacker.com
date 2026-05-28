import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const packageReferences = [
  {
    label: "shakapacker",
    url: "https://www.npmjs.com/package/shakapacker"
  },
  {
    label: "shakapacker-rspack",
    url: "https://www.npmjs.com/package/shakapacker-rspack"
  },
  {
    label: "shakapacker-webpack",
    url: "https://www.npmjs.com/package/shakapacker-webpack"
  },
  {
    label: "RubyGems shakapacker",
    url: "https://rubygems.org/gems/shakapacker"
  }
];

test("resources page links to every public Shakapacker package reference", () => {
  const resourcesPage = fs.readFileSync("prototypes/docusaurus/src/pages/examples.tsx", "utf8");

  assert.match(resourcesPage, /Package References/);
  for (const reference of packageReferences) {
    assert.match(resourcesPage, new RegExp(reference.label));
    assert.match(resourcesPage, new RegExp(reference.url.replaceAll("/", "\\/")));
  }
});

test("footer exposes package references site-wide", () => {
  const config = fs.readFileSync("prototypes/docusaurus/docusaurus.config.ts", "utf8");

  assert.match(config, /title: 'Packages'/);
  for (const reference of packageReferences) {
    assert.match(config, new RegExp(reference.label));
    assert.match(config, new RegExp(reference.url.replaceAll("/", "\\/")));
  }
});

test("homepage install gem step links directly to RubyGems", () => {
  const homePage = fs.readFileSync("prototypes/docusaurus/src/pages/index.tsx", "utf8");

  assert.match(homePage, /https:\/\/rubygems\.org\/gems\/shakapacker/);
});
