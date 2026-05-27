import assert from "node:assert/strict";
import test from "node:test";

import {
  buildChangelogMarkdown,
  rewriteChangelogLinkTarget,
  rewriteChangelogLinks
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
