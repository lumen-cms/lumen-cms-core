# App Router real page pilot

The first App Router implementation renders Bali Internships' published privacy
policy and its German translation with the existing CMS content, theme, header,
footer, navigation, search, promotion and Auth0 provider. It is an isolated
production-build experiment under `test/app-router-pilot`, with reusable code in
`src/app-router`. The production Pages catch-all has not been replaced.

The caching requirement is satisfied locally: both locale pages are generated
at build time, a third published page generates on its first visit, and subsequent
HTML and RSC requests reuse cached output. Moving to App Router alone is not a
guarantee of smaller HTML or JavaScript. The same-content comparison is recorded
in [app-router-pilot-results.json](app-router-pilot-results.json).

## Measured result

**Keep this as a pilot.** Modern Chromium requested 6.3–8.4% less first-party
JavaScript and painted the primary content earlier in the controlled local run.
However, gzip HTML grew 7.3–7.8%, and total mobile main-thread task time grew
20.3–26.2%. Neither the 20% JS reduction nor the 10% HTML reduction gate passed.
This is not evidence for an unconditional performance rollout.

Sizes below use decimal kB (1,000 bytes). Browser JS includes deferred loading
through six seconds after the root client effect, before interactions.

| Metric | English Pages → App | German Pages → App |
| --- | ---: | ---: |
| HTML, gzip | 48.72 → 52.54 kB (+7.8%) | 51.13 → 54.85 kB (+7.3%) |
| JS in initial script tags, gzip | 349.10 → 356.07 kB | 355.47 → 356.07 kB |
| JS requested, desktop, gzip | 358.66 → 329.27 kB (−8.2%) | 363.19 → 340.43 kB (−6.3%) |
| JS requested, mobile, gzip | 350.93 → 321.54 kB (−8.4%) | 363.19 → 340.43 kB (−6.3%) |
| JS requests, desktop | 25 → 19 | 25 → 22 |
| JS requests, mobile | 24 → 18 | 25 → 22 |

The App HTML references a 39.63 kB gzip `nomodule` compatibility script that
modern Chromium skips. That is why the initial script-tag total and the
browser-requested total lead to different conclusions. Both are retained.

Timing medians from five runs per cell, in milliseconds:

| Route and profile | LCP Pages → App | Root client effect Pages → App | Main-thread task time Pages → App |
| --- | ---: | ---: | ---: |
| English desktop | 80 → 72 | 484.3 → 405.3 | 190.5 → 177.5 |
| German desktop | 84 → 72 | 492.3 → 415.1 | 237.4 → 230.1 |
| English mobile | 412 → 364 | 2,775.5 → 2,419.7 | 684.3 → 863.4 |
| German mobile | 420 → 372 | 2,823.1 → 2,468.5 | 805.2 → 968.4 |

The mobile results are mixed: observed LCP is about 11% earlier and blocking
time falls from 231/238 ms to 73/70 ms, while aggregate script execution rises
from 291/349 ms to 440/499 ms. Less blocking does not mean less CPU work.
Search opening is essentially unchanged at roughly 0.84 s desktop and 0.90 s
mobile, including automation overhead and lazy dialog loading. The JSON retains
the min/max of every timing metric rather than presenting medians alone.

These are local lab observations with controlled third parties and replayed
assets. The measured response-start values remain around 5–7 ms despite the
requested CDP latency settings, so the absolute paint times must not be read as
WAN or real-device predictions. A live field improvement remains unproven.

All four full-page screenshot pairs have **zero changed pixels**. Main/footer
text, heading geometry/typography, metadata, language and JSON-LD match. Search,
mobile drawers and same-document navigation to `/imprint` work. There are no
browser execution or hydration errors. Console 404s are limited to the existing
logo's prefetches of out-of-pilot home URLs. Two image fetches were cancelled
when a test context closed; neither produced broken images in the compared
screenshots. Type checking, both production builds, scoped lint/format checks
and the existing 593-test unit suite passed.

## Routes and rendering policy

| Public URL | Content | Generation |
| --- | --- | --- |
| `/privacy-policy` | English privacy policy | Build |
| `/de/datenschutzerklaerung` | German privacy policy | Build |
| `/imprint` | English legal notice | First request, then cached |

The optional catch-all uses `generateStaticParams`, `dynamic = 'error'`,
`dynamicParams = true` and `revalidate = false`, with `cacheComponents: false`.
`params` is awaited. There are no cookies, request headers, draft mode or
request-dependent server authentication checks on these routes. The local
guides shipped with Next.js 16.4.3 were checked before implementation.
[Next.js caching guide](https://nextjs.org/docs/app/guides/caching-without-cache-components),
[dynamicParams](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/dynamicParams).

This is **SSG with generation of uncached paths**, without timed regeneration.
The first uncached request needs a Next runtime to create the HTML and RSC
artifacts. Warm requests do not execute the page data loader. This cannot be an
`output: 'export'` deployment if first-visit generation is required. Production
needs a persistent route cache; a deploy, invalidation or cache loss can cause
generation again. The checks establish sequential behavior in one local Next
process, not cross-instance locking or hosting durability.

The pilot intentionally accepts only these three published URLs. `/imprint`
models a page omitted from the build list. An arbitrary newly published CMS slug
still requires the full route-discovery adapter planned in the initiative.
Other paths return 404. Content updates require a rebuild or a future explicit
invalidation workflow; there is no publication webhook in this change.

## Implementation

`src/app-router/Content.tsx` traverses CMS content on the server. Paragraph
markdown and ordinary headlines become native HTML; browser code does not
hydrate a separate typography component for every text block. Theme typography
is emitted once by `StaticTextStyles`. Sections, rows, columns, page layout and
footer accept server-rendered children while retaining their existing MUI
styling and interactive state. Advanced headlines and supported interactive
blocks retain client components.

`PublicPage` sends selected page configuration and shared interactive settings
to the client providers instead of the complete page body, footer and promotion
documents. Auth0 remains in both versions to keep the comparison fair.
`Providers` uses App Router navigation hooks and the installed
`@mui/material-nextjs/v16-appRouter` cache provider, preserving the existing
Emotion `css` key. The shared search provider observes the existing locale/slug
context instead of importing the Pages Router singleton.
[MUI integration](https://mui.com/material-ui/integrations/nextjs/).

`metadata.ts` and `Resources.tsx` provide title, description, canonical URL,
robots, Open Graph, favicons, Google fonts, custom CSS, organization JSON-LD and
tracking/script output. The Facebook no-JavaScript image is emitted directly
because App Router does not collect `next/head`. Next's metadata output also
adds Twitter summary tags and normalizes robots/viewport formatting.

This renderer is deliberately limited. It throws for unsupported body block
types, protected/preview content, right drawers, parallax, advanced SEO schemas
and PWA metadata. The client registry is a pilot subset; this is not yet a
replacement for arbitrary consumer component overrides or every CMS document.
Signed-in redirects and interactive third-party integrations need dedicated
verification before a consumer rollout.

## Reproduce

Install the repository's locked dependencies and Playwright Chromium. The
preparation script uses the existing `.env.bali` and `.env` configuration to
fetch **published public content** once via the real `getPageProps` pipeline.
It writes snapshots, public environment settings and independent apps only
inside ignored `.next-reference/app-router-pilot`. It does not copy the draft
token. A later run with `--reuse` preserves the same snapshot.

```sh
node scripts/prepare-app-router-pilot.mjs
# Use --reuse instead when comparing an already captured snapshot.
```

Build each app from its own directory:

```sh
cd .next-reference/app-router-pilot/pages
node node_modules/next/dist/bin/next build
node node_modules/next/dist/bin/next start -p 3217 --hostname 127.0.0.1
```

```sh
cd .next-reference/app-router-pilot/app
node node_modules/next/dist/bin/next build
node node_modules/next/dist/bin/next start -p 3218 --hostname 127.0.0.1
```

With both servers running, execute from the repository root:

```sh
node scripts/measure-app-router-pilot.cjs --runs=5
node scripts/summarize-app-router-pilot.cjs docs/app-router-pilot-results.json
```

After the timing run, verify a live CMS lookup on first generation separately:

```sh
node scripts/check-app-router-pilot-live.cjs
```

This uses a disposable copy of the App build on port 3219 with an empty runtime
route cache and the `/imprint` snapshot removed. It must fetch published CMS
content, generate once, then return identical cached HTML on the repeat visit.
It preserves the measured builds and stops its own server after the check.

Start from fresh builds for the cold `/imprint` assertion. Do not visit that
page first. `--visual-only` skips timing samples; `--reuse-static` reuses an
earlier passing cold-generation check only when the recorded artifact sizes
match the unchanged builds. Full raw results, generation/build logs and eight
full-page screenshots remain under the ignored pilot directory. The committed
summary omits the large raw DOM text but retains its hash, source snapshot
hashes, measurements, ranges and verification results.

## Measurement method

Both apps use the same captured page/settings data, public assets, package
versions and source revision, built in production mode with Turbopack. Pages
uses the current `Auth0Page`, `_app` and `_document`; App uses the new server
renderer. Neither uses `next dev`. The optional `PILOT_CONTENT_SOURCE=live`
setting makes a generation use `getPageProps` directly for the same allowlisted
routes; snapshot mode keeps content changes out of the benchmark.

Chromium uses a fresh context and disabled browser cache for every sample.
Router order alternates. Desktop uses 1280×900, 20 ms latency, 10 Mbps and normal
CPU; mobile uses 375×812, 150 ms, 1.6 Mbps and 4× CPU slowdown. There are five
samples per router, route and profile: 40 timing navigations.

Fonts, images, SVGs and styles are recorded and replayed identically. External
scripts, iframe documents and analytics requests are controlled identically;
Chatwoot gets an inert SDK. Auth0 remains installed, but the measured session
is signed out. Shared-link prefetch is disabled in both fixtures. The existing
toolbar logo has a separate link and retains its prefetch behavior; the report
keeps the resulting 404s for out-of-pilot home URLs. These controls make
this a comparison of first-party rendering, not a live production Web Vitals
measurement or a test of third-party functionality.

HTML sizes are generated artifact bytes. Gzip/Brotli sizes are calculated with
Node's compressor. Initial script-tag totals include compatibility scripts;
the browser-requested JS total is more representative for modern Chromium and
includes deferred chunks through six seconds after hydration, before test
interactions. Each file is compressed separately; these totals are not measured
network transfer sizes. CSS in the HTML is already included in the HTML total.

The identical `lumen-pilot-hydrated` effect marker measures when a root client
effect runs, not the completion of every lazy component. Paint and long-task
observers run before page scripts. Final observed LCP and blocking time include
the delayed promotion; the early LCP sample is retained in the raw report.
Search-open time is a lab click-to-visible measurement including automation
overhead, not INP. Timing comparisons use medians and retain min/max ranges.

Full-page screenshot comparisons exercise the normal promotion dismissal,
load lazy images and use identical reduced-motion settings. Checks cover main
and footer text, heading positions/fonts, title/description/canonical/robots,
HTML language, alternate links and organization JSON-LD. Both source pages
currently emit no hreflang links. JavaScript-disabled checks verify full main
content and the tracking fallback. Search opens/closes, mobile drawers toggle,
and the English footer link navigates to `/imprint` without a new document.

## Rollout decision

The pilot establishes a working static App Router boundary but misses the
initiative's footprint gates. Keep the production route family on Pages while
reducing serialized RSC/client settings and the remaining MUI/Emotion layout
and navigation work. Profile the extra mobile script time before claiming a
CPU improvement. An RSC payload still
travels with the initial HTML; server components do not automatically eliminate
content duplication. Test a representative image-heavy detail page and homepage
before extrapolating from these long text pages.
