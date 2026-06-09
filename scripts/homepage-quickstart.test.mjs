import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const homePagePath = "prototypes/docusaurus/src/pages/index.tsx";

// Asserts that the quick-start step with the given title links to the expected
// docs route. Binds the title to its nearest following `docsPath` (each step
// declares exactly one), so the check is independent of indentation/formatting.
function assertStepDestination(source, title, expectedDocsPath) {
  const pattern = new RegExp(
    `title: '${title}',[\\s\\S]*?docsPath: '${expectedDocsPath.replace(/\//g, "\\/")}'`
  );
  assert.match(
    source,
    pattern,
    `expected the "${title}" quick-start card to link to ${expectedDocsPath}`
  );
}

// Regression guard for https://github.com/shakacode/shakapacker.com/issues/3:
// both install cards previously pointed at /docs/configuration, which has no
// install steps. They must link to the real install guide instead.
test("homepage install cards link to the installation guide", () => {
  const homePage = fs.readFileSync(homePagePath, "utf8");

  assertStepDestination(homePage, "Install Gem", "/docs/installation");
  assertStepDestination(homePage, "Install Files", "/docs/installation");

  // The deploy card stays pointed at the deployment guide.
  assertStepDestination(homePage, "Deploy", "/docs/deployment");

  // No quick-start step should send install/deploy traffic to the configuration page.
  assert.doesNotMatch(homePage, /docsPath: '\/docs\/configuration'/);
});
