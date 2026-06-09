import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const homePagePath = "prototypes/docusaurus/src/pages/index.tsx";

// Extracts the quick-start step object literal that begins with the given title,
// up to its closing brace, so each step's `docsPath` can be asserted in isolation.
function stepBlock(source, title) {
  const match = source.match(new RegExp(`title: '${title}',[\\s\\S]*?\\n  \\}`));
  assert.ok(match, `expected a quick-start step titled "${title}"`);
  return match[0];
}

// Regression guard for https://github.com/shakacode/shakapacker.com/issues/3:
// both install cards previously pointed at /docs/configuration, which has no
// install steps. They must link to the real install guide instead.
test("homepage install cards link to the installation guide", () => {
  const homePage = fs.readFileSync(homePagePath, "utf8");

  assert.match(stepBlock(homePage, "Install Gem"), /docsPath: '\/docs\/installation'/);
  assert.match(stepBlock(homePage, "Install Files"), /docsPath: '\/docs\/installation'/);

  // The deploy card stays pointed at the deployment guide.
  assert.match(stepBlock(homePage, "Deploy"), /docsPath: '\/docs\/deployment'/);

  // No quick-start step should send install/deploy traffic to the configuration page.
  assert.doesNotMatch(homePage, /docsPath: '\/docs\/configuration'/);
});
