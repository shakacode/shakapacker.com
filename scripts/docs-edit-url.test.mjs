import assert from "node:assert/strict";
import test from "node:test";

import { resolveDocsEditUrl } from "./docs-edit-url.mjs";

test("source-backed docs link to the matching upstream file", () => {
  assert.equal(
    resolveDocsEditUrl("configuration.md"),
    "https://github.com/shakacode/shakapacker/tree/main/docs/configuration.md"
  );
  assert.equal(
    resolveDocsEditUrl("migration/v6_upgrade.md"),
    "https://github.com/shakacode/shakapacker/tree/main/docs/migration/v6_upgrade.md"
  );
});

test("generated docs overview suppresses its edit link", () => {
  // README.md is assembled from a template and has no single upstream source.
  assert.equal(resolveDocsEditUrl("README.md"), undefined);
});

test("generated changelog edit link points at the upstream CHANGELOG source", () => {
  // Regression for #3: changelog.md is generated from the repo-root
  // CHANGELOG.md, so its edit link must not 404 at docs/changelog.md.
  assert.equal(
    resolveDocsEditUrl("changelog.md"),
    "https://github.com/shakacode/shakapacker/blob/main/CHANGELOG.md"
  );
  assert.doesNotMatch(resolveDocsEditUrl("changelog.md"), /docs\/changelog\.md/);
});
