import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const homePagePath = "prototypes/docusaurus/src/pages/index.tsx";

// Asserts that the quick-start step with the given title links to the expected
// docs route. Captures the step's own `docsPath` -- the first one after its
// title (each step declares exactly one) -- then compares the value, so a wrong
// path on one card can't pass by matching a later card's correct path. Reading
// the captured value also keeps the check independent of indentation/formatting.
function assertStepDestination(source, title, expectedDocsPath) {
  const match = source.match(
    new RegExp(`title: '${title}',[\\s\\S]*?docsPath: '([^']*)'`)
  );
  assert.ok(match, `expected a quick-start card titled "${title}" with a docsPath`);
  assert.equal(
    match[1],
    expectedDocsPath,
    `expected the "${title}" quick-start card to link to ${expectedDocsPath}, got ${match[1]}`
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
