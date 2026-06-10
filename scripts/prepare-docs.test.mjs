import assert from "node:assert/strict";
import test from "node:test";

import {
  buildChangelogMarkdown,
  buildDocsHomeMarkdown,
  correctKnownBrokenAnchors,
  rewriteChangelogLinkTarget,
  rewriteChangelogLinks,
  rewriteDocLinkTarget,
  rewriteDocLinks
} from "./prepare-docs.mjs";

test("changelog markdown injects Docusaurus frontmatter with CommonMark parsing", () => {
  const source = `# Versions

- **Added support for raw tags** such as <script async> in historical notes.
`;

  const updated = buildChangelogMarkdown(source);

  assert.match(updated, /^---\ntitle: Changelog\n/m);
  assert.match(updated, /mdx:\n {2}format: md/);
  assert.match(updated, /# Changelog/);
  assert.doesNotMatch(updated, /^# Versions$/m);
  assert.match(updated, /^## Versions$/m);
  assert.match(updated, /<script async>/);
});

test("changelog link targets preserve upstream docs as internal docs routes", () => {
  assert.equal(rewriteChangelogLinkTarget("./docs/v9_upgrade.md"), "/docs/v9_upgrade");
  assert.equal(
    rewriteChangelogLinkTarget("docs/migration/v10.1-supplemental-packages.md#steps"),
    "/docs/migration/v10.1-supplemental-packages#steps"
  );
});

test("changelog link targets send other relative paths to upstream GitHub", () => {
  assert.equal(
    rewriteChangelogLinkTarget("./README.md"),
    "https://github.com/shakacode/shakapacker/blob/main/README.md"
  );
  assert.equal(
    rewriteChangelogLinkTarget("package/ruby/shakapacker.gemspec"),
    "https://github.com/shakacode/shakapacker/blob/main/package/ruby/shakapacker.gemspec"
  );
});

test("changelog links rewrite markdown links while preserving external links and titles", () => {
  const source = [
    "[Upgrade](./docs/v9_upgrade.md#swc-loose-mode-breaking-change-v910)",
    "[Migration](docs/migration/v10.1-supplemental-packages.md \"migration guide\")",
    "[GitHub PR](https://github.com/shakacode/shakapacker/pull/1096)"
  ].join("\n");

  const updated = rewriteChangelogLinks(source);

  assert.match(updated, /\[Upgrade\]\(\/docs\/v9_upgrade#swc-loose-mode-breaking-change-v910\)/);
  assert.match(
    updated,
    /\[Migration\]\(\/docs\/migration\/v10\.1-supplemental-packages "migration guide"\)/
  );
  assert.match(updated, /\[GitHub PR\]\(https:\/\/github\.com\/shakacode\/shakapacker\/pull\/1096\)/);
  assert.doesNotMatch(updated, /\.md[)#"]/);
});

test("doc links that escape the docs tree are sent to upstream GitHub", () => {
  assert.equal(
    rewriteDocLinkTarget("../lib/shakapacker/helper.rb", "api-reference.md"),
    "https://github.com/shakacode/shakapacker/blob/main/lib/shakapacker/helper.rb"
  );
  assert.equal(
    rewriteDocLinkTarget("../../packages/shakapacker-rspack/README.md", "migration/v10.1-supplemental-packages.md"),
    "https://github.com/shakacode/shakapacker/blob/main/packages/shakapacker-rspack/README.md"
  );
  assert.equal(
    rewriteDocLinkTarget("../package.json", "installation.md"),
    "https://github.com/shakacode/shakapacker/blob/main/package.json"
  );
});

test("doc links preserve anchors and query strings when sent to GitHub", () => {
  assert.equal(
    rewriteDocLinkTarget("../README.md#installation", "v8_upgrade.md"),
    "https://github.com/shakacode/shakapacker/blob/main/README.md#installation"
  );
});

test("doc links that stay inside the docs tree are left untouched", () => {
  assert.equal(rewriteDocLinkTarget("./configuration.md", "api-reference.md"), "./configuration.md");
  assert.equal(
    rewriteDocLinkTarget("./troubleshooting.md#flash-of-unstyled-content-fouc", "rspack_migration_guide.md"),
    "./troubleshooting.md#flash-of-unstyled-content-fouc"
  );
  assert.equal(
    rewriteDocLinkTarget("../dependency-strategy.md", "blog/2026-05-10-shakapacker-10-1-supplemental-packages.md"),
    "../dependency-strategy.md"
  );
  assert.equal(rewriteDocLinkTarget("../docs/v7_upgrade.md", "v8_upgrade.md"), "../docs/v7_upgrade.md");
});

test("doc links leave external, absolute, and anchor-only targets untouched", () => {
  assert.equal(
    rewriteDocLinkTarget("https://github.com/shakacode/shakapacker", "rspack.md"),
    "https://github.com/shakacode/shakapacker"
  );
  assert.equal(rewriteDocLinkTarget("/docs/troubleshooting", "rspack.md"), "/docs/troubleshooting");
  assert.equal(rewriteDocLinkTarget("#section", "rspack.md"), "#section");
  assert.equal(rewriteDocLinkTarget("mailto:team@example.com", "rspack.md"), "mailto:team@example.com");
});

test("doc link rewriting preserves labels, titles, and in-tree links across a document", () => {
  const source = [
    "[helper.rb](../lib/shakapacker/helper.rb)",
    "[Configuration](./configuration.md)",
    "[README](../README.md \"project readme\")",
    "[GitHub](https://github.com/shakacode/shakapacker)"
  ].join("\n");

  const updated = rewriteDocLinks(source, "api-reference.md");

  assert.match(
    updated,
    /\[helper\.rb\]\(https:\/\/github\.com\/shakacode\/shakapacker\/blob\/main\/lib\/shakapacker\/helper\.rb\)/
  );
  assert.match(updated, /\[Configuration\]\(\.\/configuration\.md\)/);
  assert.match(
    updated,
    /\[README\]\(https:\/\/github\.com\/shakacode\/shakapacker\/blob\/main\/README\.md "project readme"\)/
  );
  assert.match(updated, /\[GitHub\]\(https:\/\/github\.com\/shakacode\/shakapacker\)/);
});

test("known broken anchor in rspack migration guide is repointed to the current heading", () => {
  const source =
    "See the [Troubleshooting Guide](./troubleshooting.md#exporting-webpack--rspack-configuration) for more details.";

  const updated = correctKnownBrokenAnchors(source, "rspack_migration_guide.md");

  assert.match(updated, /\.\/troubleshooting\.md#debugging-your-webpack-config/);
  assert.doesNotMatch(updated, /exporting-webpack--rspack-configuration/);
});

test("anchor corrections are scoped to the file that owns them", () => {
  const source = "[x](./troubleshooting.md#exporting-webpack--rspack-configuration)";

  assert.equal(correctKnownBrokenAnchors(source, "some-other-doc.md"), source);
});

test("docs overview leads with the installation guide", () => {
  const markdown = buildDocsHomeMarkdown([
    "installation.md",
    "configuration.md",
    "deployment.md"
  ]);

  // Installation is the first Key Guide so a new user landing on /docs sees the
  // entry point before configuration.
  assert.match(
    markdown,
    /## Key Guides\n\n- \[Installation\]\(\.\/installation\.md\)/
  );
  assert.ok(
    markdown.indexOf("installation.md") < markdown.indexOf("configuration.md"),
    "installation should be listed before configuration"
  );
});

test("docs overview omits guides absent from the synced tree", () => {
  const markdown = buildDocsHomeMarkdown(["installation.md"]);

  assert.match(markdown, /- \[Installation\]\(\.\/installation\.md\)/);
  assert.doesNotMatch(markdown, /configuration\.md/);
});
