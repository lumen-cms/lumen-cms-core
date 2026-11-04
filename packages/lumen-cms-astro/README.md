# Lumen CMS Astro

Private, source-distributed Astro renderer. This package can be installed from a
pnpm tarball or a pinned Git subdirectory; it does not need the Next CMS checkout.
It deliberately retains `private: true` to prevent accidental npm publication.

Install `astro`, `@storyblok/astro`, and `lumen-cms-shared` as consumer dependencies
alongside this package. Pin both Lumen packages to the same release/commit. Astro
compiles the TypeScript and `.astro` source; no consumer install-time build of the
CMS or React/Next dependency is required.

Named icons use the exact `@mdi/svg` version in this package's dependencies.
The Lumen integration embeds its SVG catalog in the server bundle at build time;
only rendered SVG markup reaches the browser. Named icons need neither CDN
requests nor runtime filesystem access. Custom CMS icon URLs still override
names and are fetched, sanitized, and cached server-side. Unknown names render
an empty icon with a warning. When upgrading the icon package, also update the
legacy Next renderer's pinned CDN URL; `pnpm test:astro:packages` checks parity.

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
import { loadConsumerPage, getConsumerStaticPaths } from 'lumen-cms-astro/server/consumer-pages'
export const getStaticPaths = getConsumerStaticPaths
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

### Static public site and SSR preview

For the existing `websites-astro` consumers, use one Vercel project per app.
Set `TARGET=SSG` in Production (`main`) and `TARGET=SSR` in Preview (`preview`,
plus future development branches). Without TARGET, legacy
`LUMEN_BUILD_MODE=public|preview` remains supported and defaults to preview. Both use
the usual `pnpm build`. Keep explicit `prerender = false` on API routes; remove
it from page routes and export `getConsumerStaticPaths` as shown above. Preview
builds ignore that function. Static page loading uses its original CMS slug and
published data without reading cookies or live-edit payloads. Public mode disables
preview authentication. Students detail routes export `getConsumerTravelStaticPaths`
instead; their existing `loadConsumerTravelPage` handles both modes.

Public mode uses Astro 7.4's separate build/runtime image services: prerendering
emits the existing `/_image` URLs and the runtime Sharp service transforms them.
This avoids generating tens of thousands of travel-gallery image variants during
each HTML build. Storyblok images continue to use its image CDN directly.

The following commands are the CMS repository's internal site harness, not a
replacement for the consumer apps' Vercel deployments:

```sh
# Read every published page/news/event (all API pages), check route coverage,
# and write .website-tests/astro-content/<site>/routes.json.
pnpm astro:site bali audit

# Full public build; rejects sample routes and configuration overrides.
pnpm astro:site bali generate

# Separate preview/API server build, with the same site environment.
pnpm astro:site bali build --config astro.server.config.mjs
```

Replace `bali` with `planet` or `upskill`. Publish the public artifact from
`packages/lumen-cms-astro/dist/<site>/`. The Node preview entrypoint is
`packages/lumen-cms-astro/dist/<site>-server/server/entry.mjs`; deploy its complete
server/client output behind HTTPS with the site's runtime environment. Keep
`LUMEN_SITE_URL` set to the public canonical origin. Configure the preview token,
preview secret and identical routing/locales on the SSR service. Its internal
Astro sessions currently use filesystem storage: keep that storage persistent on
a single Node instance, or configure a shared session driver for multiple instances.
Consumer applications using `server/request` instead use signed cookies.

The inventory includes noindex pages, excludes non-page components, and respects
`PUBLIC_ROOT_DIRECTORY` and `PUBLIC_EXCLUDING_SLUGS`. Folder locales are enumerated
from their own stories; field-level translations fetch each configured language.
The report compares every returned published story with the generated route list
and identifies synthetic locale homes separately. It verifies enumeration, not a
successful render of every page; the full build must also pass before deployment.
Translations follow the Content Delivery API's fallback/publication semantics.
Custom routes backed by other services (for example travel details) still need
their own static route enumeration.

In Storyblok Settings > Visual Editor, configure the preview environment as:

```text
https://preview.example.com/api/preview?secret=URL_ENCODED_SECRET&slug=
```

Storyblok appends the story path. The endpoint establishes a preview session and
redirects to the SSR route, retaining editor/release query parameters. Each page
loads draft content. Unsaved Bridge input is sent through the SDK middleware and
applied before enrichment, then the SSR result updates the document. Rich-text
typing has an immediate browser update while reconciliation is pending. New
stories do not need a public build to preview. The public artifact stays unchanged
until Generate completes. Set the home story's Real path to `/` and verify block
selection, unsaved edits, locale navigation, save/reload and release previews in
the hosted iframe. HTTPS and iframe-compatible cookies are required.

### Generate button wiring still required

Use a manual [Storyblok Task Manager](https://www.storyblok.com/docs/apps/task-manager)
task named **Generate public site**, pointing at the hosting platform's build hook.
The app currently requires a Growth plan; a separate authenticated admin button
can call a build trigger instead. No build-hook endpoint or hosted task is configured
by these local commands.

The build job installs locked dependencies, runs `pnpm astro:site <site> generate`
with published credentials and site configuration, and deploys the resulting
static directory only after success. Preserve the previous deployment on failure,
serialize jobs per site, and expose build status/logs through the hosting platform.
Keep webhook credentials in the task/CI configuration. The request should enqueue
a job, not run the build inside an HTTP request. Save is for drafts; Publish makes
content eligible; Generate builds the current published snapshot. Do not attach
an automatic publish webhook if releases should happen only on Generate.

Public forms, feeds, search/list endpoints and other runtime APIs still need a
server deployment or routing to the API service; static hosting cannot execute
them. Configure that routing and CORS separately from the authenticated preview
pages. `/api/clear-cache` is not a replacement for Generate.

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

Set `PUBLIC_STORYBLOK_TOKEN` for published requests. Draft requests
require `STORYBLOK_PREVIEW_TOKEN` and a random `LUMEN_PREVIEW_SECRET` of at least
32 characters. Preview uses an eight-hour signed, HttpOnly cookie, Secure and
SameSite=None on HTTPS. Use an HTTPS development host for the Storyblok iframe.
Third-party-cookie restrictions and Vercel deployment protection still require
testing in the actual editor environment.

Live editing uses one official Storyblok Bridge, the SDK's exported preview
middleware, `getPayload`, and `StoryblokServerData`. Lumen registers the middleware
explicitly and disables the SDK's automatic Bridge bootstrap so it can handle
input before forwarding it to `handleStoryblokMessage` (SDK 10.4.0 debounces that
handler by 500 ms). Do not add a second Bridge: its `initOnlyOnce` guard can leave
one of the listeners inactive in the editor iframe.

Rich-text typing and common formatting update synchronously in the preview
browser. Existing link text preserves its server-rendered anchor; changed link
destinations, images, embedded blocks, and unsupported marks wait for SSR. The
SDK still reconciles the complete document after typing pauses, including styles,
fonts and widgets. New input cancels older responses immediately. Bridge overlay
nodes survive reconciliation. Unsaved stories are applied before component/font/
page-hook enrichment, so those hooks run once per update instead of twice.
Public pages contain neither the rich-text snapshots nor this preview bootstrap.

This is a Lumen optimization around the official SSR approach, not a claim that
Astro's default preview renders everything client-side. See the
[official Astro SDK guide](https://www.storyblok.com/docs/libraries/js/astro-sdk)
for payload reuse and cancelable preview events, and the
[official preview quickstart](https://www.storyblok.com/docs/quickstarts/astro/visual-preview)
for using the live payload before falling back to a Content Delivery API fetch.
The installed SDK source is authoritative for the 500 ms timing (the public guide
currently labels itself version 8.x).

Regression checks:

```sh
pnpm test:astro
pnpm astro:check
pnpm --filter lumen-cms-astro exec astro build --config astro.server.config.mjs
node scripts/check-astro-preview.cjs
```

The browser check sends input through the actual Bridge inside a local iframe,
asserts that 20 edits paint before any POST, and verifies a single SDK
reconciliation request. It does not require live CMS credentials.

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
`pnpm test:astro:packages`. This also builds CSS from an isolated consumer with
the renderer copied into `node_modules`, checking that Tailwind generates the
DaisyUI controls and utilities used by the package. The stylesheet explicitly
registers its source directories because Tailwind skips dependencies during
automatic discovery. Also pack and install in an external consumer before
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

## Environment variables

Use `PUBLIC_*` for non-secret site settings and browser-visible values. For example,
`PUBLIC_ROOT_DIRECTORY`, `PUBLIC_LANGUAGES`, `PUBLIC_SUPPRESS_SLUG_LOCALE`,
`PUBLIC_OVERWRITE_SETTINGS_PATHS`, `PUBLIC_TRAVEL_HEADER_FALLBACK_IMG`,
`PUBLIC_GA`, `PUBLIC_GTM_CONTAINER`, and `PUBLIC_STORYBLOK_TOKEN` (published content only).
The config helper embeds public settings into builds, including settings supplied
through the consumer's committed `site-settings.json`.

Server credentials have no public prefix: `STORYBLOK_PREVIEW_TOKEN`,
`LUMEN_PREVIEW_SECRET`, `TRAVEL_GRAPHQL_ENDPOINT`, `AUSLANDSZEIT_API_KEY`,
`SHOPIFY_GQL_AUTH`, and `AUTH_API`. Configure these in Vercel and an ignored local
`.env.local`. Never place server credentials in `PUBLIC_*` settings.

The Astro packages no longer read legacy Next environment names or
`STORYBLOK_PUBLIC_TOKEN`; use `PUBLIC_STORYBLOK_TOKEN` instead. The independent
Next renderer and existing Next consumer files retain their original names.
Only the legacy comparison tooling translates a private copy of old settings.

### Vercel branch deployment policy

Use one project per website: `main` is Production with `TARGET=SSG`;
`preview` is the persistent Storyblok Preview branch with `TARGET=SSR`.
Future `develop` and feature branches also use the Preview environment's SSR setting.
`TARGET` takes precedence over the legacy `LUMEN_BUILD_MODE=public|preview` setting.
Both environments run the same `pnpm build` command. Keep the released code on
`main` and `preview` aligned, and point the Generate deploy hook at `main`.

The shared config injects `/sitemap.xml`: SSG prerenders it from the same published
CMS locale and travel route inventories used by the pages. SEO-hidden stories,
error pages and configured ignored paths are excluded from search discovery.
The URLs always use the configured public `site` origin. SSR returns 404 for this
endpoint and adds `X-Robots-Tag: noindex, nofollow` globally through middleware,
including unauthenticated pages and API responses. `robots.txt` may allow crawling
so search engines can read noindex. Preview authentication remains necessary for drafts.
The same integration generates `robots.txt`: public builds advertise the public
sitemap; SSR permits crawling so noindex can be read and advertises no sitemap.
The consumer build wrapper also sets the SSR noindex header globally in Vercel's
output configuration, covering public-folder assets and hosting redirects.

### Initial-load performance

Backgrounds in the first top-level page-body block (`sectionPosition === 0`), or
with the CMS `priority` flag, receive eager loading and high-priority preloads.
This is a positional rule, not viewport/LCP detection. Portrait alternatives use
`picture` sources and matching media-qualified preloads.

YouTube iframe/player components require activation before loading the player.
Tawk/Facebook chat blocks also require a click (including blocks with the legacy
`disable_lazy` setting); scrolling does not load them. HubSpot account loaders
configured as external CMS scripts use `lazyOnload`, with
`hsConversationsSettings.loadImmediately = false` set before execution. A local
launcher opens the HubSpot widget on demand. The tracking/bootstrap script can
still load HubSpot's small Conversations SDK; the widget itself waits for a click.
HubSpot forms and meetings initialize within 300px of the viewport.

The Astro layout initializes provider queues early so conversion events can be
queued before vendor libraries load. Lazy libraries wait for window load, eager
high-priority image decoding, and a paint opportunity, then idle (with a 2-second
idle timeout). Hidden tabs do not depend on animation frames. `PUBLIC_GA` overrides
Storyblok `setup_google_analytics`; blank overrides fall back to Storyblok.
`PUBLIC_GTM_CONTAINER` independently enables a GTM container. Custom scripts retain their CMS strategy, except known
HubSpot account loaders. This is scheduling only, not consent enforcement.
HubSpot's automatic collection of non-HubSpot forms is an account-level feature;
turn it off in HubSpot if unused. The renderer does not silently disable it or
remove global analytics, cookie banners, or existing lead collection.

Run `node scripts/check-astro-third-parties.cjs` for the isolated browser audit
(mocked providers; no analytics events are sent to real accounts).

### Project-based image optimization

On Vercel, set the build-time `PUBLIC_REMOTE_IMAGE_OPTIMIZER=vercel` and pass
`vercelImageConfig` from `lumen-cms-astro/images/vercel-config` as the adapter's
`imagesConfig`. Keep `imageService: false` so local assets and explicit transforms
use Astro's existing Sharp service. Ordinary Storyblok images use its CDN directly.
Approved remote still photos use `/_vercel/image`, with AVIF/WebP negotiation and
`minimumCacheTTL: 31536000` (365 days). Source URLs must be immutable; change the URL
or purge Vercel's image cache when replacing an image. Animated sources and explicit
format/crop requests use the project's Astro image service. Unknown remote hosts
are not optimized; add trusted sources to the remote allowlist to enable processing.
Node/local deployments use Astro's image service without a shared proxy or signing secret.


### Google Analytics workers

`defineLumenConfig` uses the official `@astrojs/partytown` integration to serve
worker assets. Generated `gtag.js` tracking (Storyblok `setup_google_analytics`,
or the `PUBLIC_GA` override) runs in a worker. The integration forwards both
`gtag` and `dataLayer.push`; forms and checkout keep their existing event API.
Initialization explicitly assigns `window.gtag` so it remains callable across
worker scripts. Browsers without service-worker support initialize the queue
before Partytown's main-thread fallback, without configuring GA twice.

Development and CMS preview still exclude generated tracking. Sites with a
nonempty `PUBLIC_GTM_CONTAINER` keep the existing main-thread Google path to
avoid splitting a shared dataLayer across execution environments. Arbitrary
CMS scripts, Facebook, HubSpot and AdRoll are unchanged. Sites without an
analytics ID do not acquire one. Retired `UA-…` Universal Analytics IDs are
skipped; setting a GA4 `G-…` ID later enables the same worker integration.

GA4's automatic page-exit `user_engagement` event is unreliable in a worker;
this is a documented Partytown limitation, not equivalent to complete tracking
parity. Do not depend on worker execution for events emitted immediately before
navigation without testing that flow.

Run `pnpm test:astro:google-worker` for worker/fallback conversion contracts.
`TEST_REAL_GOOGLE=1 pnpm test:astro:google-worker` additionally fetches the real
Google SDK and checks page_view, early generate_lead, purchase and custom-event
payloads against a main-thread control. Collection is intercepted locally so
synthetic conversions are not sent to the production property. This verifies
outbound payloads, not acceptance in GA reports.

References: https://partytown.qwik.dev/astro/ and
https://partytown.qwik.dev/google-tag-manager/.
