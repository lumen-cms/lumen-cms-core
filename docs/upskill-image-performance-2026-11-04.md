# Upskill image performance investigation — 4 November 2026

## Research and implementation

The renderer uses `CmsImage.astro`, a custom Astro component, rather than importing the built-in `Image` for every asset. This is appropriate for Storyblok: the CDN already resizes and negotiates WebP, while the wrapper uses `getImage()` for applicable local assets. Reprocessing Storyblok files through another optimizer is unnecessary. See [Astro CMS/CDN guidance](https://docs.astro.build/en/guides/images/#using-images-from-a-cms-or-cdn) and [Storyblok caching and Accept negotiation](https://www.storyblok.com/docs/concepts/caching).

Astro's [priority-image contract](https://docs.astro.build/en/reference/modules/astro-assets/#priority) combines eager loading, high fetch priority and synchronous decoding. Our wrapper implemented the first two but always defaulted to async decoding. Preloaded images now default to sync; explicit decoding overrides remain supported. Matching orientation-specific preloads and picture sources remain intact. The document also preconnects to the Storyblok image origin. Background candidates now include 480 and 768 pixels to avoid the previous 640-to-960 jump on mobile.

Cards previously advertised viewport fractions and only 320/640/960/1280 candidates. Their actual boxes can be smaller because of containers, gutters, and sliders. Cards now explicitly opt into `sizes="auto, ...existing fallback..."` while remaining lazy. This uses measured CSS width in supporting browsers and preserves media-query fallbacks elsewhere. Only definite-size card boxes opt in; general fill backgrounds retain existing behavior. Added 480 and 768 candidates and a default card quality of 65 (explicit `PUBLIC_IMAGE_QUALITY` still overrides it). See the [HTML image standard](https://html.spec.whatwg.org/dev/images.html) for lazy auto sizing and [Storyblok quality](https://www.storyblok.com/docs/api/image-service/operations/quality) for CDN compression.

## Findings and measurement limits

The supplied mobile report has 7.3 s simulated LCP and identifies the portrait hero as the LCP element. The hero is already server-rendered, eagerly requested, and about 25 KiB. Inspection found no hydration, entrance-animation, or hidden-state gate around it. A fresh public Lighthouse trace reported 3.0 s simulated LCP and about 965 ms observed render delay, including substantial GPU/compositing work. Local baseline runs did not consistently reproduce that large delay. Synchronous decoding alone did not demonstrate a reliable improvement. This change corrects the priority contract and reduces downloads; it does not prove that the original remote timing spike is resolved.

Controlled comparison used Lighthouse 13.6.0, default mobile simulation, the same machine, gzip-compressed static builds, and unchanged analytics. These are individual local runs, not production PageSpeed results or statistically significant guarantees:

| Metric | Before | After |
| --- | ---: | ---: |
| Mobile performance | 94 | 95 |
| Mobile simulated LCP | 2.80 s | 2.56 s |
| Mobile FCP | 1.21 s | 1.20 s |
| Mobile TBT | 117 ms | 146 ms |
| Mobile CLS | 0.025 | 0.025 |

Updated desktop: 100 performance, 0.80 s LCP, 0 ms TBT. Observed LCP subpart timings and simulated metrics must not be added or compared as if they use the same time model.

In matched mobile image requests, the six program cards changed from 960px/quality75 to 768px/quality65, saving about 38% transfer bytes. The hero changed from 960px to 768px at the same quality, saving about 25%. Desktop card boxes and portrait/landscape hero selection were visually inspected. Browser selection still respects device pixel ratio.

## Analytics and verification

No tracking or consent code changed. Both compressed mobile runs recorded GA4 `page_view` requests for `G-E5T41KXD1F` returning HTTP 204. This confirms successful collection requests, not dashboard processing or custom conversion attribution.

Passed:
- Production homepage sample build.
- `node scripts/check-astro-image-priority.cjs`: mobile/desktop image selection, one matching hero preload, no inactive hero download, sync priority default and explicit override, lazy card sizing and unchanged box dimensions.
- `node scripts/check-astro-third-parties.cjs`: deferred vendor libraries and early event queues.
- Image policy, URL and proxy unit tests: 3 files, 10 tests.
- `git diff --check`.

Existing unrelated checks remain failing:
- `astro check`: one invalid nested `column` fixture in `src/pages/ui-regressions/[fixture].astro:36`; no diagnostics in changed image files.
- The older `check-astro-images.cjs` fixture assumes remote assets use local Sharp output, but current code routes them to the shared proxy and requires `IMAGE_PROXY_SECRET`. It was left unchanged; the new focused test uses deterministic Storyblok responses.

## Rollout

Changes are local in the shared `lumen-cms-core` renderer. Nothing has been pushed or deployed. The `websites-astro` consumers pin published CMS commits; release the shared changes, update the consumer pin/lockfile using the existing distribution workflow, then rebuild Upskill. Re-run mobile and desktop PageSpeed against that deployment, and investigate a remote trace if the multi-second render delay persists. Do not report the local 95 as a production score.

## Follow-up: third-party sources and first-paint scheduling

The production script plan contains Storyblok GA `G-E5T41KXD1F`, Facebook pixel `726824377950061`, and the custom HubSpot account loader `4063132`. HubSpot adds analytics, collected forms, banner, and conversations bootstrap scripts. Chat UI remains click-only; embedded forms/meetings remain viewport-loaded. The production Vercel environment inventory contains neither `PUBLIC_GA` nor `PUBLIC_GTM_CONTAINER`.

All configuration paths were checked: Storyblok `setup_google_analytics`, `setup_facebook_pixel`, AdRoll IDs, and `settings.scripts`; Astro `PUBLIC_GTM_CONTAINER`; legacy Next `NEXT_PUBLIC_GA` and `NEXT_PUBLIC_GTM_CONTAINER`, translated by reference tooling to Astro names. Astro's tracking generator previously ignored `PUBLIC_GA` even though the shared config exposed it. It now supports the trimmed environment GA override, falling back to the CMS ID without creating a second GA library/config. The Next runtime is unchanged.

The old `lazyOnload` loader could insert vendor scripts at the first idle callback after load, before the priority image had decoded and painted. Lazy scripts now wait for eager/high-priority image decoding and two animation frames before idle scheduling. This is tied to page readiness, not a Lighthouse-specific delay, user-agent check, or interaction requirement. Hidden tabs skip frame waiting; a bounded frame fallback covers tabs backgrounded during scheduling. Early tracking queues and custom before/after-interactive strategies remain unchanged.

Controlled diagnostics with all vendor requests blocked reduced blocking time to zero, but local simulated LCP did not consistently reproduce the large PSI swings. The first updated compressed local build measured 95 performance, 2.56s simulated LCP, 165ms TBT, and 17ms observed hero render delay. Its GA page_view returned HTTP 204. These local observations are not a claim of consistent production improvement; subsequent production PSI measurements are required.

Regression coverage now gates priority decoding independently from window load, asserts vendor requests follow a paint opportunity, preserves an early conversion queue, and checks repeated initialization does not reload GA. Tracking unit tests cover environment override and CMS fallback. See [Google's LCP guidance](https://web.dev/articles/optimize-lcp) on JavaScript competing with rendering.
