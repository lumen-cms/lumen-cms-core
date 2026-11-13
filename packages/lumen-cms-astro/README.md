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

## Optional Vercel Speed Insights

The shared `SiteLayout` includes the official Astro Speed Insights component,
disabled by default. After confirming the Vercel project's Speed Insights tier
is **Free**, set these Production environment variables (or consumer `environment`
defaults), then rebuild. Free collection starts with the deployed SDK; no paid
dashboard activation is needed:

```dotenv
LUMEN_SPEED_INSIGHTS=1
LUMEN_SPEED_INSIGHTS_SAMPLE_RATE=0.1
```

Collection requires a production build with `VERCEL_ENV=production` and excludes
CMS preview pages. Local development, Vercel Preview deployments, and non-Vercel
hosts do not collect. The default sample rate is 10%; rates must be greater than
0 and at most 1. Invalid rates disable collection. Query strings and fragments
are removed from reported URLs, and Storyblok editor query URLs are dropped.
The script runs in the browser, outside Partytown. Set `LUMEN_SPEED_INSIGHTS=0`
and rebuild to disable it.

These settings do **not** select or enforce a billing tier. Never enable Plus
for a zero-cost setup. Vercel's Free allowance is shared across the team, and
collection pauses at the limit without overage charges; sampling helps stretch
that allowance but is not a billing cap. Check the current
[Vercel pricing documentation](https://vercel.com/docs/speed-insights/limits-and-pricing)
before enabling collection on each project. Installing core does not activate
Speed Insights in Vercel or change project billing settings.

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
The initial page view is queued explicitly with automatic config page views
disabled (`send_page_view: false`) to avoid property-dependent worker startup
behavior and duplicate initial views. Other events retain their existing path.
Initialization explicitly assigns `window.gtag` so it remains callable across
worker scripts. Browsers without service-worker support initialize the queue
before Partytown's main-thread fallback, without configuring GA twice.

Development and CMS preview still exclude generated tracking. Sites with a
nonempty `PUBLIC_GTM_CONTAINER` keep the existing main-thread Google path to
avoid splitting a shared dataLayer across execution environments. Arbitrary
CMS scripts, HubSpot, Chatwoot and AdRoll are unchanged. Sites without an
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
synthetic conversions are not sent to the production property. Collection checks include both `google-analytics.com` and
`analytics.google.com`; `TEST_GOOGLE_ID=G-…` selects another property for this
intercepted test. This verifies
outbound payloads, not acceptance in GA reports.

References: https://partytown.qwik.dev/astro/ and
https://partytown.qwik.dev/google-tag-manager/.


For a live deployment check, run `pnpm test:astro:google-deployment <url> ...`.
It observes normal page views (without generating test conversions), checks
worker execution and one successful page view per destination, and includes
Google's `analytics.google.com` collection endpoint as well as
`google-analytics.com`. A site without a configured GA4 ID must emit no Google
collection requests.


### Facebook Pixel workers

`defineLumenConfig` also enables Facebook workers by default. Generated Storyblok
`setup_facebook_pixel` scripts run through Partytown with `fbq` forwarding, while
HubSpot, Chatwoot and other CMS scripts retain their existing path. Multiple pixel
IDs and the noscript image fallback remain supported. `PUBLIC_FACEBOOK_WORKER=0`
is a build-time rollback switch; it does not change Google Analytics behavior.
The standalone static fixture config keeps its existing main-thread Facebook path.

The injected `/~facebook/[...path]` endpoint requires the consumer's Astro server
adapter (all six consumers already use one). It only fetches public Facebook SDK
and numeric pixel-configuration scripts from `connect.facebook.net`. It rejects
other paths and redirects, forwards no cookies, and does not proxy collection.
Pixel configuration is not cached; the SDK has a five-minute cache lifetime.

Native fallback initializes an immediate queue when workers are unsupported and
replays early Facebook forwards when worker registration fails. Tests cover both
fallback paths, multiple pixels, event IDs, and conversion payloads. Do not treat
page views alone as evidence that checkout or automatic event tracking works.

Run `pnpm test:astro:facebook-worker` for the component contracts, and
`node --test scripts/facebook-audit/parse-event.test.cjs` for collector tests.
`pnpm test:astro:facebook-audit` serves a loopback-only real-SDK comparison with
synthetic collection intercepted locally. This harness must never be deployed.
Outgoing request parity is not proof of Meta reporting or attribution.

## Auth0 accounts and FastSpring ebooks

Enable accounts per consumer with `LUMEN_AUTH_ENABLED=1` **at build time and at
runtime** and configure a server adapter. Pure static hosting cannot serve auth
endpoints. Public routes remain prerendered through `getConsumerStaticPaths`;
protected routes and pages containing `auth_container`/`auth_form` (including
shared header/footer content) are excluded and served by the injected SSR
fallback. Keep the catch-all example above; do not replace its static path loader
with the unfiltered `staticRoutes`. Auth blocks fail closed if accidentally
prerendered. The built-in fallback uses `SiteLayout`; consumers with custom
wrappers/renderers should add explicit SSR account routes using
`loadConsumerPage` and their own layout.

Create an Auth0 **Regular Web Application** for the Astro consumer. Existing
React SPA applications can remain separate. Configure these server variables:

| Variable | Purpose |
| --- | --- |
| `LUMEN_AUTH_ENABLED` | `1` enables routing and browser session lookup |
| `LUMEN_SITE_URL` | Canonical origin; HTTPS except localhost |
| `AUTH0_DOMAIN` | Auth0 tenant/custom domain |
| `AUTH0_CLIENT_ID` | Regular Web Application client ID |
| `AUTH0_CLIENT_SECRET` | Server-only client secret |
| `AUTH0_SESSION_SECRET` | Random secret of at least 32 characters; same across instances |
| `AUTH0_AUDIENCE` | Optional existing account API audience |
| `AUTH_API` | Existing account service base URL; absent disables profile mutations |
| `AUTH_PERMISSION` | Role claim name, defaults to `roles` |
| `AUTH_PERMISSION_KEY` | Optional field name for object-valued role entries |
| `AUTH_PATH_REQUIRED_ROLES` | JSON array, e.g. `[{"path":"/account","roles":["any"]},{"path":"/account/admin","roles":["admin"]}]` |

Register `<origin>/auth/callback` as an Allowed Callback URL and `<origin>/` as
an Allowed Logout URL. Enable refresh tokens/offline access for the account API
when using it. Secrets are runtime configuration and must never use `PUBLIC_`.
Changing the session secret invalidates existing application sessions.

Use `/auth/login?returnTo=/account`, `/auth/signup?returnTo=/account`, and
`/auth/logout` as normal links. CMS button `on_click_function` values `login`,
`signup`, and `logout` also render native links when auth is enabled. Login/signup
accept `locale`; return destinations are restricted to the canonical origin.
The SDK owns PKCE, callback validation and encrypted HttpOnly session cookies.
`GET /api/auth/session` exposes only the normalized public profile, never tokens.

`auth_container` retains existing CMS display/role rules and personalization;
role checks are server-side, segment-aware and use the most specific configured
path. `auth_form` uses `PATCH /api/account` for first/last name and `DELETE
/api/account` for confirmed deletion. Mutations require the canonical Origin and
`X-Lumen-CSRF: 1`. The server derives `sub` from its session, obtains the API token,
and adapts to the existing upstream GET `/api/update-user` and
`/api/delete-user` contracts. Email cannot be edited. An unavailable upstream is
reported without discarding form values. Authenticated/personalized responses
are `private, no-store`; account actions are disabled in authenticated CMS preview.

FastSpring continues to deliver the files. Guests can check out without signing
up; signed-in buyers receive current `sub`/`email`/`id` tags. Checkout waits for
session and SDK readiness, with visible errors and retry. Popup completion uses
the CMS success link for both guests and signed-in buyers, or displays a success
message without navigation. `/refetch` is a compatibility redirect to `/` and
never opens a login popup. Browser purchase callbacks do not grant permissions
or prove payment; tracking is deduplicated by order reference within a document.

The shared store defaults to the legacy authenticated refresh behavior;
Astro explicitly selects `completion: 'redirect'`. React's provider now reads
its user from the existing auth store and reads current values in SDK callbacks.
No React runtime or Auth0 client SDK is added to Astro browser bundles.

Validation commands:

```sh
pnpm exec vitest run --project unit test/astro/auth.test.ts test/astro/auth-routes.test.ts test/astro/auth-pages.test.ts test/astro/fastspring.test.ts test/astro/fastspringProvider.test.ts
pnpm --filter lumen-cms-astro build
pnpm test:astro:commerce
LUMEN_AUTH_ENABLED=1 pnpm --filter lumen-cms-astro exec astro build --config astro.server.config.mjs
pnpm test:astro:auth
```

The browser/server checks use local fixtures, simulated checkout and encrypted
test sessions. Before enabling a production consumer, separately verify login,
signup, guest purchase, signed-in purchase and actual ebook delivery against its
Auth0 test application and FastSpring test storefront.
