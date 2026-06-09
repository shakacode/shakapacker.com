// Resolves the "Edit this page" target for a synced doc, given its path within
// the docs tree (the `docPath` Docusaurus passes to `editUrl`).
//
// Most docs are copied verbatim from the upstream `docs/` tree, so their edit
// link points back at the matching upstream file. Two pages are generated at
// build time by `prepare-docs.mjs` and have no `docs/<file>` counterpart
// upstream, so pointing them at `docs/<file>` would 404:
//
//   - README.md    the docs overview index, assembled from a template
//   - changelog.md rendered from the repo-root CHANGELOG.md
//
// The overview has no single source file, so its edit link is suppressed; the
// changelog has a real source, so it points at the upstream CHANGELOG.md.
const UPSTREAM_DOCS_TREE =
  "https://github.com/shakacode/shakapacker/tree/main/docs/";
const UPSTREAM_CHANGELOG =
  "https://github.com/shakacode/shakapacker/blob/main/CHANGELOG.md";

export function resolveDocsEditUrl(docPath) {
  if (docPath === "README.md") {
    return undefined;
  }
  if (docPath === "changelog.md") {
    return UPSTREAM_CHANGELOG;
  }
  return `${UPSTREAM_DOCS_TREE}${docPath}`;
}
