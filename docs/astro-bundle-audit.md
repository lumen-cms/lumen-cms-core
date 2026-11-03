# Astro SDK registry and production bundle audit

Verified 2026-11-03 with the installed Astro 7.4.4 and @storyblok/astro 10.4.0.

## Rendering

`Block.astro` delegates default component selection to the official
`StoryblokComponent`. A single `componentRegistry.mjs` supplies mappings for both
static and SSR builds. Consumer overrides still take precedence. Small adapters
in `components/blocks` preserve nested layout slots, resolved relationships, and
legacy content transformations; ordinary components are registered directly.

`lumen-cms-astro/integration` supplies this registry and disables the bridge on
public builds. Pass `{ preview: true }` only for the authenticated SSR preview.
The SDK's registry still imports server components eagerly in this installed
version. That does not send their rendering code to browsers. The measurements
below verify actual client downloads, not simply the files emitted by a build.

Preview uses `getPayload`, `storyblokEditable`, and `StoryblokServerData`. Small
public Shopify catalogs (up to 128 KiB of serialized data) are reused across
matching page edits. Scope includes page/settings identity, locale, and store;
global edits fetch again. Settings and credentials are not added to this payload.
Large catalogs stay server-side. Public pages emit no server-data payload.

The existing cancelable preview update handler remains: the installed SDK's
body morph does not refresh CMS head styles and preserves old DOM attributes.
Removing that handler would regress changed/deleted styles and native-widget
remounting. It now forwards the SDK server-data payload along with the story.
The existing custom rich-text/link handling and delivery enrichment hooks are
retained; this refactor does not replace them or introduce deprecated SDK APIs.

## Isolated production pages

Every case goes through the same Document and SDK registry as real pages. Each
runs in a fresh Chromium context. Tabs are clicked, and slider/calendar/video
initialization is checked. The audit rejects unrelated component entry scripts,
Storyblok SDK downloads, editor code, public server-data payloads, and unexpected
heavy libraries. Native video must not download a provider SDK.

| Page | JS bytes | Computed gzip bytes | Optional library loaded |
| --- | ---: | ---: | --- |
| text | 5,716 | 2,768 | None |
| tabs | 10,871 | 4,924 | None |
| swiper | 11,850 | 5,411 | None |
| advanced | 123,317 | 38,004 | Swiper |
| slider | 11,850 | 5,411 | None |
| images | 6,075 | 2,998 | None |
| lightbox | 12,109 | 5,579 | None |
| shopify | 19,292 | 9,061 | None (checkout SDK deferred) |
| shopify-checkout | 22,699 | 10,564 | None (checkout SDK deferred) |
| calendar | 303,300 | 94,148 | FullCalendar |
| calendar-month | 253,697 | 80,622 | FullCalendar |
| calendar-below | 9,540 | 4,844 | None |
| advanced-below | 9,531 | 4,842 | None |
| parallax-below | 9,793 | 4,957 | None |
| youtube-light | 12,399 | 5,918 | None |
| list | 12,739 | 5,908 | None |
| video | 12,399 | 5,918 | None |

The text page's shared scripts implement the document's CMS action handling,
header behavior, and navigation drawers. Tabs use DaisyUI's CSS scroll-snap
carousel and a native controller. Basic sliders, image lightboxes and Shopify
product images share a separate small native controller; advanced sliders keep
Swiper. The calendar bundle includes the configured
FullCalendar plugins/locales. These are not claims of a theoretical minimum
within each widget library.

The earlier tabs refactor dropped its page from 23,186 to 3,811 gzipped bytes
(83.6% smaller). Current totals above include subsequent shared page scripts.
The tab-specific increment over the text page is 2,156 bytes, about 2.1 KiB.
The bundle regression rejects Swiper on the tabs fixture and caps the complete
tabs page, including shared scripts, at 6 KiB gzipped.

### Tab parity checks

`pnpm test:astro:tabs` serves the production Astro fixture beside the real
`src/components/tabs/Tabs.tsx` and its MUI/Grid/Swiper dependencies. Both consume
the same CMS fixture. The reference harness simplifies only leaf CMS content
and uses the default MUI theme; it does not mock tab state or carousel behavior.

The comparison passes for horizontal and vertical layouts, selected/visible
panel state, clicks, manual keyboard activation (Arrow/Home/End moves focus,
Enter/Space selects), real Chromium touch gestures, wrapping in both directions,
desktop mouse dragging, active-panel dimensions, and selection retention when
resizing to mobile. It caught and corrected the previous Astro auto-selection
on arrow keys and missing vertical-panel padding.

Additional checks cover scrollable headers, empty/single-item lists, content
height changes, reduced motion, form controls, inactive-panel accessibility,
controller disposal/remounting, and Storyblok live updates introducing tabs.
Native scroll timing/physics are browser-defined rather than Swiper-identical.
Inactive form DOM remains mounted, as in the previous Astro renderer; unlike
MUI's default unmounting, switching tabs preserves entered form values.
The gesture suite runs in Chromium, not an exhaustive physical-device matrix.

## Other carousel replacements

`Swiper.astro` selects `NativeSlider.astro` for ordinary one-slide layouts, and
`AdvancedSwiper.astro` otherwise. `ImageLightbox.astro` is rendered only when the
CMS enables a lightbox; plain image grids load neither carousel controller.
Shopify image selection uses the same native controller and preserves its
existing variant/price/cart/checkout store wiring.

The routing predicate deliberately retains Swiper for fade/cube/coverflow/flip/
cards/creative effects, free mode, dynamic bullets, multiple or fractional
slides per view, and spaced slide layouts. Reproducing their exact responsive
geometry, grouped navigation, momentum and effects needs more than daisyUI's
scroll-snap primitive. The Swiper dependency remains required for those cases.

Current whole-page gzip sizes are about 5.3 KiB for basic sliders and 5.4 KiB
for lightboxes; the previous basic Swiper fixture was 36,774 bytes. Shared
scripts have also changed since that earlier measurement. The native controller
is about 1.7 KiB gzip and is shared when several carousel types appear together.
The product fixture is now 8.8 KiB before checkout (previously 22.2 KiB).
The configured product + cart fixture is 10.3 KiB. The audit checks native-controller
isolation as well as absence of Swiper, and enforces 9 KiB whole-page budgets for
basic sliders/lightboxes and 11 KiB for Shopify before checkout.

`pnpm test:astro:carousels` compares the production Astro carousel with the real
Next.js `LmNukaCarousel` (the shared implementation used by legacy sliders,
lightboxes and Shopify). It exercises single-slide, looping, bounded and
autoplay configurations, direct pagination, previous/next, real touch gestures,
mouse dragging, mobile resizing, hover pause and Astro preview remounting.
The bounded reference config checks navigation semantics rather than rendering
the separate Next.js `LmSwiper` wrapper. Additional mobile browser checks cover
lightbox keyboard/open/close behavior and Shopify slide-to-variant synchronization.
The full fixture suite also covers CMS styles/options, prices, checkout errors,
and every retained Swiper effect. Unit tests cover autoplay lifecycle, explicit
reduced-motion playback, empty lists and routing to the advanced renderer.

Native animation duration and touch physics are browser-defined. Loop boundaries
rewind to the opposite end rather than reproducing Swiper's continuous track.
These are behavioral parity tests, not a claim of pixel-identical animation or
coverage of every physical browser/device. No live checkout is submitted.

Validation for the carousel follow-up: 278 Astro unit tests pass; Astro check
reports zero errors/warnings/hints; production bundle checks, the full component
browser fixture, reduced-motion/accessibility checks and the carousel comparison
suite all pass. The comparison includes mobile lightbox and Shopify gestures.

## Lazy Shopify checkout

`shopifyProvider.ts` imports the GraphQL SDK only inside `createCheckout`, after
validating the storefront configuration. Selection, image swiping, cart opening,
quantity updates and add-to-cart need only the small shared store. Empty or
unconfigured checkouts do not load the SDK. The browser caches the imported module;
product and cart checkout use the same SDK. Storefront configuration is captured
before awaiting the import so a preview update cannot retarget an in-flight checkout.

The separate SDK chunk is 14,764 bytes gzip and loads only after a checkout click.
The bundle audit records initial page requests separately from checkout requests,
rejects the SDK on every initial page, and rejects *all* Shopify runtime modules
on pages without a Shopify product/cart. It verifies real SDK payloads and headers
against intercepted requests: failed product checkout, duplicate click protection,
quantity changes, successful cart checkout/navigation and module reuse. A separate
browser check aborts the SDK download and verifies the existing recoverable error
UI. No live storefront transaction is created. The deferred SDK budget is 18 KiB.

Astro may emit unused optional chunks because the package supports all CMS
components. These checks concern code linked/downloaded by a consumer page, not
removal of unused files from the deployment directory. Pages without Shopify
receive neither its store/controllers nor its checkout SDK.

## Remaining heavy runtimes

FullCalendar and advanced Swiper now enhance their existing server markup within
400 px of the viewport, or on keyboard focus. A shared loader handles duplicate
mounts, import failures with a retry button, unmounting during imports, and CMS
remounts. Above-the-fold components load immediately; no extra click is required.
The calendar retains its 500 px layout reservation while loading.

FullCalendar imports only plugins needed by the CMS `views` configuration and
only the selected locale. All configured views are ready together so switching
views preserves the existing navigation and dialog behavior. Default calendars
still support month/week/day/agenda; a French month-only calendar downloads
neither time-grid/list plugins nor German/Italian/Spanish locale files.

| Scenario | Initial whole-page gzip | Additional JS after activation |
| --- | ---: | ---: |
| Calendar below viewport, all views | 4,844 B | 89,574 B |
| Advanced Swiper below viewport | 4,842 B | 33,432 B |
| Parallax below viewport | 4,957 B | 6,131 B |
| YouTube light preview | 5,918 B | 4,148 B on click |
| Server-rendered story list | 5,908 B | 0 B on endpoint pagination |

A visible calendar remains substantial: 94,148 B gzip for all views, or 80,622 B
for month only. Lazy loading defers that cost; it does not remove the required
calendar engine. Splitting libraries into separately compressed chunks introduces
some overhead versus the old 86,504 B monolithic all-view page. Visible advanced
Swiper pages similarly pay a small loader/chunk overhead. The largest savings
are on pages where these widgets are initially offscreen or absent.

Parallax does not import its controller until near the viewport and never imports
it for a visitor who initially prefers reduced motion. Failure leaves a static
section. Legacy story-list delivery/rendering (including Storyblok client and
rich-text code) loads only when the legacy fallback performs a request; initial
server HTML and HTML-endpoint pagination do not use it. Existing media-provider
imports already defer until visibility/play-preview activation and remain intact;
the audit now verifies YouTube loads only its own provider, with a mocked remote
YouTube API. Native video loads no provider SDK.

FastSpring is intentionally unchanged: its SDK supplies initial product prices
and availability, so checkout-only loading would hide or invalidate product UI.
It is scoped to configured FastSpring pages. Server-only dependencies such as
image processing/HTML sanitizing do not add initial browser runtime here. Tiny
shared interaction helpers are not split into extra network requests.

Validation: 288 Astro unit tests and type checks pass, including comparison of
calendar event transformation with the Next.js renderer's actual helper. Browser
regressions cover all calendar views, five locales, week-start rules, expired
and repeated events, colors and dialogs; all retained Swiper effects; parallax;
and list search/pagination, history, retries and stale responses. New checks cover
unmounting during a delayed calendar import, repeated CMS remounts, import retry,
reduced-motion downloads, per-view/plugin isolation, and pre/post-activation size
budgets. The calendar UI remains FullCalendar rather than Next.js's
react-big-calendar; these are behavior/contract checks, not pixel-identical UI.

## Real published pages

| Site | Route | JS bytes | Computed gzip bytes | Swiper |
| --- | --- | ---: | ---: | --- |
| bali | `/` | 33,927 | 17,411 | No |
| bali | `/traineeship-bali-indonesia` | 27,697 | 14,215 | No |
| bali | `/fees` | 24,826 | 12,943 | No |
| planet | `/` | 130,092 | 41,751 | Yes |
| planet | `/pricing` | 36,910 | 13,155 | No |
| planet | `/app-sports-coaches` | 128,854 | 41,163 | Yes |
| upskill | `/` | 24,900 | 12,132 | No |
| upskill | `/sustainable-tourism-summer-course-bali` | 18,647 | 9,056 | No |
| upskill | `/accommodation-study-abroad-bali` | 18,647 | 9,056 | No |

No sampled real page requested Shopify runtime code, the checkout SDK,
FullCalendar, third-party video provider modules or editor code. These nine
routes (three each for Bali, Planet and Upskill) were remeasured after the
heavy-runtime deferral. Bali’s homepage fell from 48,830 to 17,411 initial gzip
bytes because its offscreen Swiper waits for visibility. Pages with visible
advanced sliders still download Swiper, plus the small deferred-loader overhead. Other routes are not exhaustively browser-tested; the same
per-page isolation assertions apply whenever the audit runs against them.

## Reproduce and limits

```sh
pnpm test:astro:bundles
pnpm test:astro:bundles bali
pnpm test:astro:bundles planet
pnpm test:astro:bundles upskill
```

Each command rebuilds production output. The site commands use the first three
routes from `test/websites/sites.json`. Detailed reports and module-to-chunk
metadata are under `.website-tests/bundle-audit/<site>/`; they are not published.
The existing build guard also rejects React/Next/MUI/Emotion runtime imports.

Sizes include local JS requests, their transitive/dynamically requested modules,
and executable inline scripts. Gzip sizes are calculated per file/script, not
measured wire transfers. External services are blocked during measurement;
third-party analytics/widget downloads are excluded. Later scroll/click-triggered
features and every route in each site have not been exhaustively exercised.
This audit checks JavaScript isolation, not per-page CSS minimality.

Validation for native tabs: Astro check has zero errors/warnings/hints; the
252-test Astro unit suite and the 8 focused native/React tab tests pass;
production static and SSR builds pass; the component browser regressions,
direct Next.js tab comparison, and authenticated SDK preview browser suite
pass. A live Storyblok
iframe acceptance test remains separate from the local SDK/browser tests.

Lazy checkout validation: 283 Astro unit tests, Astro type checks, the full
component browser fixture, and bundle audits for fixtures and all three sampled
production consumers pass. Checkout browser tests use the real SDK with mocked
network responses.
