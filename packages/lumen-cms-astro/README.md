# Lumen CMS Astro

Private, source-distributed Astro renderer. This package can be installed from a
pnpm tarball or a pinned Git subdirectory; it does not need the Next CMS checkout.
It deliberately retains `private: true` to prevent accidental npm publication.

Install `astro`, `@storyblok/astro`, and `lumen-cms-shared` as consumer dependencies
alongside this package. Pin both Lumen packages to the same release/commit. Astro
compiles the TypeScript and `.astro` source; no consumer install-time build of the
CMS or React/Next dependency is required.

```js
import vercel from '@astrojs/vercel'
import { defineLumenConfig } from 'lumen-cms-astro/config'

export default defineLumenConfig({
  site: 'https://example.com',
  locales: ['en', 'de'],
  adapter: vercel(),
})
```

The helper loads the consumer's `.env` and `.env.local` without replacing existing
process variables, configures Storyblok, Tailwind, images and the runtime bundle
guard, and bundles the two source packages. `environment` can contain non-secret
site defaults; routing defaults are compiled into the deployment. Secrets remain
runtime environment variables. Optional Astro settings can be supplied, but
replacing `vite` or `integrations` replaces those complete default objects.

Create `src/pages/[...slug].astro`:

```astro
---
import SiteLayout from 'lumen-cms-astro/SiteLayout.astro'
import { loadConsumerPage } from 'lumen-cms-astro/server/consumer-pages'
export const prerender = false
const page = await loadConsumerPage(Astro)
if (page instanceof Response) return page
---
<SiteLayout page={page} />
```

Load from route frontmatter, before rendering nested components, so missing pages
and protected pages retain HTTP 404/401 responses before streaming starts.
Register optional data hooks in a consumer setup module imported before loading.
Travel consumers use `loadConsumerTravelPage`, explicit detail routes, the
`server/travel` hooks/endpoints, and the `travel/*.astro` component exports.

## Preview and APIs

- `server/request`: `enterConsumerPreview`, `exitConsumerPreview`, and
  `isPreviewRequest`. Mount the first two under `/api/preview` and
  `/api/exit-preview`.
- `server/sitemap`: the standard endpoint and `createSitemapApi` for extra hooks.
- `server/form-endpoint`, `server/published-story-lists`, `server/feed`: optional
  server handlers. These need an on-demand adapter.
- `server/clear-cache`: clears this function instance's application caches only.
  Consumers should protect this administrative handler. It is not distributed
  CDN invalidation or a static rebuild webhook.
- The older `server/preview` and `server/exit-preview` exports use Astro sessions
  and are retained for the internal preview service. New consumers use
  `server/request` instead; no external session store is required.

Set `STORYBLOK_PUBLIC_TOKEN` (or the compatible
`NEXT_PUBLIC_STORYBLOK_PUBLISHABLE_KEY`) for published requests. Draft requests
require `STORYBLOK_PREVIEW_TOKEN` and a random `LUMEN_PREVIEW_SECRET` of at least
32 characters. Preview uses an eight-hour signed, HttpOnly cookie, Secure and
SameSite=None on HTTPS. Use an HTTPS development host for the Storyblok iframe.
Third-party-cookie restrictions and Vercel deployment protection still require
testing in the actual editor environment.

Public requests explicitly use published content, including in development.
Consumer documents currently return `private, no-store`; do not enable Vercel ISR
until preview bypass and invalidation have been implemented and verified. CMS
data retains process-local caching; clearing one instance is not a global flush.

## Private Git distribution

With pnpm 11, consumers can depend on these two sources at the same full SHA:

```text
git+ssh://git@github.com/lumen-cms/lumen-cms-core.git#<40-character-SHA>&path:/packages/lumen-cms-astro
git+ssh://git@github.com/lumen-cms/lumen-cms-core.git#<40-character-SHA>&path:/packages/lumen-cms-shared
```

Commit the consumer lockfile. The install environment needs read access to the
private repository; connecting a website repository to Vercel does not by itself
configure SSH credentials for package installation. Configure a read-only deploy
key/known host or use authenticated private-registry artifacts in CI. Never put
credentials in dependency URLs. The separate `websites-astro` repository includes
`cms:local` and `cms:git` commands to keep all five apps on the same source.

Validation in this repository: `pnpm astro:check`, `pnpm test:astro`, and
`pnpm test:astro:packages`. Also pack and install in an external consumer before
shipping; workspace builds alone cannot detect missing files or undeclared peers.

## Shared layout and 404 pages

`SiteLayout.astro` owns the document, SEO, scripts, header and footer. Its default
slot renders the CMS page when no children are supplied. Custom pages can replace
that content while keeping the site shell:

```astro
<SiteLayout page={page}>
  <h1>Custom page</h1>
  <p>Your custom content goes inside the layout's main landmark.</p>
</SiteLayout>
```

The old `lumen-cms-astro/Document.astro` package export remains an alias for compatibility.

`defineLumenConfig` automatically registers an on-demand `/404` fallback for
server deployments, including Vercel. Unmatched requests retain their URL and
select the locale from the first URL segment: `/de/missing` uses German,
`/it/missing` uses Italian, and unprefixed or unknown locale paths use the first
configured locale. No Vercel rewrites or redirects are needed. Keep the default
integrations when customizing the config so the fallback remains registered.

Consumer page loaders also render the CMS `error-404` story on missing routes with HTTP
404 and noindex metadata. The shared resolver looks in the active locale and
configured root folder (for example `de/site/error-404`), including field-level
translations. If the story is absent but settings exist, the layout displays a
basic not-found message. Delivery failures still surface as errors.

Static builds emit the default `404.html` and localized `<locale>/404/index.html`
pages. Static hosting must route missing locale URLs to their corresponding error
file **with status 404**; the local sample server does this automatically. Both
sitemap endpoints exclude CMS paths containing an `error-404` segment regardless
of editor robots settings. Custom sitemap hooks must also avoid adding error URLs.
