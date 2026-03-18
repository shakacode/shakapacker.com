# Cloudflare Pages Setup

## Target Configuration

- Pages project: `shakapacker-com`
- Default hostname: `https://shakapacker-com.pages.dev/`

## Required GitHub Secrets

Set in `shakacode/shakapacker.com` repository settings:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Optional repository variable:

- `CLOUDFLARE_PAGES_PROJECT` (defaults to `shakapacker-com`)

## Manual Domain Step

Wrangler CLI does not currently expose custom-domain attach for Pages. Complete in Cloudflare dashboard:

1. Workers & Pages -> `shakapacker-com`
2. Custom domains -> `Set up a custom domain`
3. Add:
   - `shakapacker.com`
   - `www.shakapacker.com` (optional)

After domain setup, Cloudflare provisions TLS automatically.

## Redirect Strategy

### Site-level redirects (this repo)

Configured in `prototypes/docusaurus/static/_redirects`:

- `/shakapacker/docs/*` -> `/docs/*` (301)
- `/shakapacker/docs` -> `/docs` (301)

### Legacy host redirects (shakacode.com zone)

If you have historical URLs under `www.shakacode.com/shakapacker/docs/*`, add redirect rules on the `shakacode.com` zone:

| Source | Destination | Status |
|--------|-------------|--------|
| `www.shakacode.com/shakapacker/docs/*` | `https://shakapacker.com/docs/*` | 301 |

Verify by visiting an old docs URL and confirming a 301 redirect to `shakapacker.com`.

## Worker Build Defaults

If you keep the separate Cloudflare Worker build pipeline enabled for this repo:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

`package.json` and `wrangler.toml` are configured so these default commands resolve docs, build Docusaurus, and deploy static assets without extra CLI flags.
