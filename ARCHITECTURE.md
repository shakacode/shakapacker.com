# shakapacker.com Architecture

## Decision

Use a hybrid model:

- Canonical docs remain in the `shakapacker` monorepo (`docs/`)
- `shakapacker.com` is a dedicated site repo
- Site fetches docs content at build time

## Framework

Selected framework: **Docusaurus**.

## Content Flow

```
shakapacker/docs  -->  content/upstream/docs  -->  prototypes/docusaurus/docs  -->  build/deploy
```

1. `npm run sync:docs` copies docs from monorepo into `content/upstream/docs`
2. `npm run prepare:docs` hydrates Docusaurus docs directory
3. Docusaurus builds static output at `prototypes/docusaurus/build`
4. Cloudflare Pages deploys the static output

## Deployment Target

- Cloudflare Pages project: `shakapacker-com`
- Default hostname: `https://shakapacker-com.pages.dev/`
- Intended custom domain: `https://shakapacker.com/`

## Redirects

`prototypes/docusaurus/static/_redirects` includes legacy path redirects:

- `/shakapacker/docs/*` -> `/docs/:splat`
- `/shakapacker/docs` -> `/docs`
