import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const packageReferences = [
  {
    label: "shakapacker",
    url: "https://www.npmjs.com/package/shakapacker",
    registry: "npm",
    packageName: "shakapacker"
  },
  {
    label: "shakapacker-rspack",
    url: "https://www.npmjs.com/package/shakapacker-rspack",
    registry: "npm",
    packageName: "shakapacker-rspack"
  },
  {
    label: "shakapacker-webpack",
    url: "https://www.npmjs.com/package/shakapacker-webpack",
    registry: "npm",
    packageName: "shakapacker-webpack"
  },
  {
    label: "RubyGems shakapacker",
    url: "https://rubygems.org/gems/shakapacker",
    registry: "rubygems",
    packageName: "shakapacker"
  }
];

test("resources page links to every public Shakapacker package reference", () => {
  const resourcesPage = fs.readFileSync("prototypes/docusaurus/src/pages/examples.tsx", "utf8");

  assert.match(resourcesPage, /Package References/);
  for (const reference of packageReferences) {
    assert.match(resourcesPage, new RegExp(reference.label));
    assert.match(resourcesPage, new RegExp(reference.url.replaceAll("/", "\\/")));
    assert.match(resourcesPage, new RegExp(`registry: '${reference.registry}'`));
    assert.match(resourcesPage, new RegExp(`packageName: '${reference.packageName}'`));
  }
  assert.match(resourcesPage, /data-package-version-output/);
});

test("footer exposes package references site-wide", () => {
  const config = fs.readFileSync("prototypes/docusaurus/docusaurus.config.ts", "utf8");

  assert.match(config, /title: 'Packages'/);
  for (const reference of packageReferences) {
    assert.match(config, new RegExp(reference.label));
    assert.match(config, new RegExp(reference.url.replaceAll("/", "\\/")));
    assert.match(config, new RegExp(`'data-package-version-registry': '${reference.registry}'`));
    assert.match(config, new RegExp(`'data-package-version-name': '${reference.packageName}'`));
  }
});

test("homepage install gem step links directly to RubyGems", () => {
  const homePage = fs.readFileSync("prototypes/docusaurus/src/pages/index.tsx", "utf8");

  assert.match(homePage, /https:\/\/rubygems\.org\/gems\/shakapacker/);
  assert.match(homePage, /packageRegistry: 'rubygems'/);
  assert.match(homePage, /packageName: 'shakapacker'/);
  assert.match(homePage, /data-package-version-registry=\{step\.packageRegistry\}/);
  assert.match(homePage, /data-package-version-name=\{step\.packageName\}/);
});

test("client package version module fetches current versions from registries", () => {
  const config = fs.readFileSync("prototypes/docusaurus/docusaurus.config.ts", "utf8");
  const clientModule = fs.readFileSync(
    "prototypes/docusaurus/src/client/packageVersions.ts",
    "utf8"
  );

  assert.match(config, /clientModules: \['\.\/src\/client\/packageVersions\.ts'\]/);
  assert.match(clientModule, /registry\.npmjs\.org/);
  assert.match(clientModule, /rubygems\.org\/api\/v1\/gems/);
  assert.match(clientModule, /data-package-version-registry/);
});
