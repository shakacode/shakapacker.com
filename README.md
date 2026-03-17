# shakapacker.com

Production site workspace for [shakapacker.com](https://shakapacker.com), built with Docusaurus.

## Architecture

- Canonical markdown source stays in `shakapacker/docs/`
- This repo syncs docs at build time into `prototypes/docusaurus/docs`
- Site-owned pages live here (landing page, examples, support page)

## Local Development

1. Install site dependencies:
   - `npm run install:site`
2. Sync docs from monorepo and prepare local docs tree:
   - `npm run prepare`
3. Run the site:
   - `npm run dev`
4. Run docs validation scan:
   - `npm run audit:docs`

## Build

- Build from prepared docs:
  - `npm run build`
- Full build from fresh docs sync:
  - `npm run build:full`

## Docs Sync Source Resolution

`scripts/sync-docs.mjs` resolves the monorepo in this order:

1. `SHAKAPACKER_REPO` env var
2. sibling directory `../shakapacker`
3. shallow clone from `SHAKAPACKER_REPO_URL` (default: upstream GitHub repo)

## Cloudflare Pages

- Project: `shakapacker-com`
- Build output directory: `prototypes/docusaurus/build`
- One-off deploy from local machine:
  - `npm run cloudflare:deploy`

For GitHub Actions deploy, configure these repository secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Optional repository variable:
- `CLOUDFLARE_PAGES_PROJECT` (defaults to `shakapacker-com`)

## Auto Publish Trigger

`shakacode/shakapacker` should include `.github/workflows/trigger-docs-site.yml`, which dispatches
`docs-updated` events to this repository when `docs/**` changes on `main`.

That source workflow requires these secrets in `shakacode/shakapacker`:
- `DOCS_DISPATCH_APP_ID`
- `DOCS_DISPATCH_APP_KEY`
