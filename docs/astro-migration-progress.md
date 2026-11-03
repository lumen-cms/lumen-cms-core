# Astro migration progress

Branch: `feature/astro-daisyui`, based on `feature/mui-v9`.

## Required final state

- Entire core renderer and server paths/props run through Astro, with no React,
  Next, MUI, Emotion, or React Hook Form dependency in the Astro implementation.
- Storyblok fields, authoring workflow, responsive custom CSS, submissions,
  integrations and consumer overrides retain their behavior.
- Static public builds plus a separate server-rendered preview.
- Run the existing 30-route desktop/mobile visual suite for Bali Internships,
  Planet and Upskill; inspect differences rather than accepting baselines.
- Retain the broader all-route inventory and full-library fixture coverage.

## Current acceptance status (2026-11-03)

The sections below are a chronological implementation log. Earlier statements
about missing components or tests describe that stage, not the current branch.

| Requirement | Current evidence | Scope and verification limits |
| --- | --- | --- |
| Work stays on `feature/astro-daisyui` | Current Git branch verified before the latest changes | None |
| Native renderer without React/Next/MUI/Emotion | Build-time emitted-module guard; static samples and standalone server builds pass | Guard remains enabled; final builds pass |
| All active component dispatches | Registry audit: 74 of 76, including the two previously disabled Instagram names | Auth container/form explicitly deferred by user |
| Preserve component props | Native components, shared helpers and client modules; 204 contract tests plus six-width fixture suite | Appearance and dynamic CardList lifecycle regressions pass |
| Preserve arbitrary responsive CMS CSS | Shared declaration compiler compared with legacy sx; mobile/tablet/desktop/hover boundary and precedence tests | No CMS schema changes required |
| Preserve fonts, palette and layout | Theme contract tests, real MUI grid comparison, native layout fixtures and live-site captures | Final rebuilt comparisons reviewed; pixel identity was not required |
| Preserve submission contracts | Shared Google parser/transport; native form payload/validation checks with mocked requests | No real submissions performed |
| Server routes/props | Public page loader, preview/exit, cache, sitemap/feed, form endpoint, dynamic-list and travel adapters; standalone API/SDK preview suite passes | Auth0 `/logout` and `/refetch` explicitly deferred |
| Astro images with Storyblok transformations | Astro assets component/service, image URL tests and real-page builds | Track existing upstream missing assets separately |
| Official Storyblok Astro SDK | SDK installed; editable attributes and authenticated input-message path exercised locally | Hosted editor iframe handshake has not been exercised; do not claim otherwise |
| 30 pages across all three sites | Multiple complete 180-comparison baselines, all responses 200/no overflow in latest completed run | Final 02:55 run includes all fixes, plus one successful live-timeout retry; see reports below |

A direct legacy-prop-read review found that grid sizing/body/background props,
headline counters, image-list item fields, event dates, icon fields, media props,
list query/search props, calendar colors, card image radii and advanced styles
are delegated rather than absent. Category autocomplete appearance was the
concrete missing field found by that review and now has six-width browser
coverage. Dispatch coverage alone remains insufficient to establish parity.

## Historical implementation log

## Implemented foundation

- Added Astro and shared workspace packages; exact dependency versions locked.
- Standalone Astro static build with Tailwind Vite integration and DaisyUI.
- CMS style compiler without MUI runtime imports, preserving raw declarations,
  priority, theme references, shadows and breakpoint boundaries.
- Compatibility tests compare rules to the legacy MUI renderer.
- Framework-independent route generation for locale and root-directory paths,
  with explicit collision errors.
- Native Astro recursive rendering for layout primitives, typography, images,
  backgrounds, buttons, cards, accordions, iframes, icons, avatars, sliders and
  initial list widgets, dividers and tabs. Native Google Forms and general
  form-builder components replace React Hook Form in the Astro renderer.
  Counting headlines and the remaining interaction surface still
  need implementation.
- Framework-independent theme output preserves current default palette, custom
  palette shades, elevation shadows and responsive typography; local pure color
  math and token snapshots retain the upstream MIT license.
- Astro server adapter reuses the current framework-independent enrichment
  pipeline. Bundle audit confirms no React/Next/MUI/Emotion runtime imports.
- Captured all 90 enriched page-data fixtures (30 per site) from published CMS
  data, using the actual consumer environment files without modifying them.
  The tracked component inventory is `docs/astro-component-inventory.json`;
  full page captures are ignored under `.website-tests/astro-content/`.

## Validation so far

- Existing TypeScript check passed after workspace test isolation.
- Legacy and new style suites: 18 passing tests.
- Astro style/route/theme/grid/server-dependency and image-service/form-client suites: 19 passing tests.
- Astro standalone static build passed with `ASTRO_TELEMETRY_DISABLED=1`.
  This is a component fixture, not a migrated consumer website.
- Chromium fixture checks passed at 375, 599, 600, 899, 900 and 1280px.
  Native container/row/column widths, offsets, padding and margins match the
  actual existing React/MUI renderer for a two-column fixture. This does not
  yet prove nested grids or every custom CSS combination.
- Astro check passes for 51 files with no diagnostics. A diagnostic Bali
  homepage build also passes; unsupported blocks remain explicitly marked
  when diagnostic mode is enabled. This is not a production acceptance check.
- Live data loading completed for all 90 sampled routes. No full-site visual
  comparison has been run yet.

## Next work

1. Complete shared schema ownership and independent package type checks.
2. Port theme tokens, responsive typography, global CSS and layout primitives.
3. Wire the real CMS delivery/enrichment pipeline into Astro pages and preview.
4. Port the complete renderer registry and all interactions/integrations.
5. Integrate actual consumer overrides and configuration, then run all 90
   sampled routes at both viewports and investigate the reports.

No consumer migration, preview, full component coverage or
three-site visual result is claimed complete by the foundation checks.

## Current implementation details to finish

- Astro's current checker requires TypeScript 6.0.3, isolated to the Astro
  workspace. The existing core remains on TypeScript 7.0.2.
- `pnpm astro:site <site> inventory --sample` captures enriched published data;
  this does not render pages or run screenshot comparisons.
- `pnpm astro:check` checks Astro components, `pnpm test:astro` runs migration
  unit/contract tests, and `pnpm test:astro:fixture` compares the built native
  fixture with the existing MUI grid in Chromium.
- The Astro image component and custom image service use Storyblok
  transformation URLs. SVG styling and image/background geometry still need
  broader compatibility verification.
- Per-block CSS is collected into the document head so style elements do not
  change CMS child selectors or grid spacing. Synthetic blocks and authored
  CSS precedence still need broader browser coverage.
- Server modules and generated schema still refer to existing shared source;
  finish package ownership/export isolation before publishing the Astro package.

## Native interactions and forms

- Tabs support keyboard navigation, swipe, responsive orientation and active
  panel accessibility through native HTML and Swiper core. Flex rows insert
  native dividers with the existing mobile visibility behavior.
- Google Forms preserve the existing parser output and shared submission
  function, including GET/no-cors, repeated checkbox answers, local Date
  string encoding, honeypot behavior and opaque-response success display.
- General form builders preserve JSON POST, status-200 success, required
  checkbox groups, boolean/array values, numeric hidden fields, container
  overrides and tracking. Native `lumen:form-submit` events expose submitted
  values to consumer handlers; consumer integrations still need migration.
- Chromium checks cover tab selection/keyboard/orientation and divider
  visibility at six viewport widths. Intercepted form requests verify
  required fields, honeypots, Google answer encoding and builder JSON payloads.
  No live form submissions were made. Broader consumer form styling, error
  variants and all integration workflows still need verification.

## Navigation and strict site rendering

- Added the native toolbar, responsive sections, logo variants, menus,
  navigation lists, left/right drawers, search palette and snackbar renderer.
  The document now includes its header, drawers, global snackbars and chat
  component slots; individual chat integrations still need porting.
- Keyboard menu selection, mobile drawer open/Escape dismissal, search
  results/escaping/keyboard selection, and snackbar dismissal cookies pass
  Chromium checks. Search requests are mocked in the browser fixture.
- Search request parameters are compared with the existing fetcher for
  default, localized and root-directory searches. Only the published public
  token is passed to the native search client.
- Strict Bali build now renders all 30 sampled routes without diagnostic fallback.
- List search/category filters preserve legacy OR matching and URL state;
  gallery layouts/lightbox, static containers, tables, links and parallax are
  implemented. Native motion supports fade/slide/grow/zoom/collapse with the
  existing CMS timing, direction and intersection settings.
- Planet now strictly builds all 30 sampled routes after the native player port.
  Upskill still stops at `list_stories` on `/blog-articles`.
- 27 unit tests pass. Astro check reports 63 files with zero errors/warnings.
  Browser fixtures pass at six widths; additional checks cover gallery keyboard
  navigation, list filtering, parallax activation and all five motion types.
- The visual runner accepts `--local-framework astro` with `--base-url`; live
  references retain Next readiness checks. Three runner browser tests pass,
  including Astro without window.next and unchanged redirect/pixel guards.
- Initial Bali run was invalid because the runner expected Next readiness.
  Corrected 60-case run: `.website-tests/results/bali/2026-11-02T09-57-45-281Z-ecd5f7`.
  Completed: 0 exact passes, 0 dynamic-only, 60 failures. Results show substantial
  differences in typography, spacing, image presentation and search metadata;
  German home also reports new broken images. No visual parity is claimed.
- The full three-site visual passes remain outstanding. Header scroll variants,
  permanent drawers, logos and all author-style combinations require broader
  visual comparison; the interaction fixture is not proof of full parity.

## Shared CSS parity corrections

- Fixed CSS layer order before head-collected grid rules. Previously those rules
  established `components` before `base`, allowing the reset to override layout.
- Disabled Tailwind Preflight while keeping theme and utility imports. Native
  CMS HTML now retains the browser heading/list defaults used by CssBaseline.
  The baseline preserves box sizing and font smoothing without MUI.
- Ported all existing CMS global utility rules (spacing, display, colors,
  backgrounds, font classes, embeds and progress styles) into the shared package.
  Rule-by-rule light/dark comparisons against the legacy helper pass. The server
  bundle audit includes the shared theme and confirms no UI framework runtime.
- 30 unit tests pass across nine files. Browser fixture checks cover native HTML
  heading sizes/margins and the head-layer ordering case as well as interactions.
- Homepage-only visual recheck after these fixes: desktop changed pixels reduced
  from 69.5866% to 25.3933%; mobile from 80.4117% to 50.2193%. Both still fail.
  Report: `.website-tests/results/bali/2026-11-02T10-06-46-134Z-42e5ec/report.html`.
  This is not a rerun of the full 30-page suite and does not prove site parity.
- Restored search mode metadata and XL icon breakpoint. The above visual report
  predates this metadata fix; no pixel differences were accepted or hidden.

## Native media and Planet visual evidence

- `player` uses the same native media elements underlying ReactPlayer, loaded
  only on activation. Native audio/video, HLS, DASH, Mux, YouTube, Vimeo, Wistia,
  Spotify, Twitch and TikTok selection matches the legacy provider precedence.
  No React wrappers are imported. Existing source selection, preview images,
  noembed thumbnails, volume/mute/loop/controls, hover XOR playback, lazy loading
  and responsive aspect ratios are preserved.
- Native `section_video_bg` maps its existing property list to this player,
  maintains responsive cover sizing and overlay content, and reveals the image
  fallback on media errors. Third-party provider playback requires further live
  verification; fixtures mock media playback and validate configuration/events.
- 44 unit tests across 10 files pass, including 14 provider comparisons and a
  client bundle audit covering all native media dependencies without React/MUI.
  Astro check covers 66 files with zero errors/warnings. Browser fixtures verify
  preview activation, playback flags, hover play/pause and video cover geometry
  at mobile and desktop sizes using intercepted media requests.
- Planet strict build: all 30 routes. Full visual run completed with 0 exact
  passes, 0 dynamic-only and 60 failures. Report:
  `.website-tests/results/planet/2026-11-02T10-13-21-473Z-94d135/report.html`.
  Remaining differences include geometry/typography and search opener bounds.
  Autoplay attribute correction was made after this run; no results were accepted.

## Story-list work in progress

- Added a framework-free query builder with explicit server-resolved defaults.
  Category OR groups, match-all page categories, text queries, locale defaults,
  page sizes and sort orders are compared against the current implementation.
- Native compact pagination page/ellipsis sequences match MUI's hook for result
  counts 0–8, 10 and 30, including every page in each count.
- Added shared `StoryListResults` and native `NewsList` rendering; existing list
  widgets now use this renderer. News title/description/read-more rendering and
  existing filters pass browser checks. Card lists can disable their internal
  30-item reveal limit for externally paginated story lists.
- Added the public Storyblok SDK request adapter with forced published version;
  its client bundle passes the no-React/MUI audit. Preview requests remain a
  separate server-side task. No preview token is serialized into this adapter.
- `list_stories` now renders initial HTML and native controls. Browser fetching
  reuses Astro-generated result templates for image/subtitle/description variants.
  Dynamic image URLs retain Storyblok responsive transforms. Rich-text rendering
  is shared without importing server configuration into the browser.
- Native browser tests pass for pagination, escaped titles, truncation, search
  page resets, stale responses, empty results, errors/retry, history navigation
  and responsive image source binding. Draft-preview pagination still requires
  the separate SSR preview path; public requests are published-only.
- Upskill strictly builds all 30 sampled routes. Full visual report completed:
  `.website-tests/results/upskill/2026-11-02T10-32-04-993Z-a59279/report.html`.
  Result: 0 exact passes, 0 dynamic-only, 60 failures. This run predates restoration
  of global promotions, whose absence caused missing announcement warnings.
  One Google Maps iframe reported a sandbox browser error; the current legacy
  sandbox helper is reused unchanged, so live-site policy drift needs review.
- Current verification: 50 unit tests in 11 files, broader browser fixtures and
  dedicated story-list checks passing, Astro check covering 73 files without errors.
- `node scripts/astro-registry-audit.cjs --write` produces
  `docs/astro-registry-coverage.json`: 52 of 76 legacy UI names have direct Astro
  dispatch, 24 remain, plus three provider/override hooks. This inventory is not
  proof that dispatched components support every prop or achieve visual parity.
- Restoring promotion output reduced the Upskill homepage changed pixels from
  32.1250% to 21.1097% desktop and 42.8610% to 37.2568% mobile. Both still fail.
  Focused report: `.website-tests/results/upskill/2026-11-02T10-36-51-585Z-c54d69/report.html`.
  The legacy slider's `lm-carousel` class was restored afterward for CMS selector
  compatibility and accurate dynamic-region identification; it is not yet rerun.

## Native dialogs and dynamic content lifecycle

- Added native `<dialog>` rendering with inert template content, mounted only on
  opening and removed on close. CMS trigger/body/custom title, padding, slide-up,
  responsive fullscreen and close restrictions retain the existing props.
- Browser fixtures verify mobile fullscreen versus desktop bounds, Escape and
  backdrop close, locked dialogs, explicit close, history navigation, restored
  opener focus, nested tab initialization and reset of values/state on reopening.
  The dialog title excludes close-button text from its accessible name.
- Dynamic mounts initialize component scripts. Shared unmount cleanup now stops
  players, motion timers/animations, tabs/sliders, search requests/listeners,
  story-list listeners and video resize observers. Remaining component observer
  lifecycles (including parallax and navigation) still need a complete audit.
- Verification: fixture build passed; browser fixtures passed at six layout
  widths with dialog behavior at 375/1280; dedicated story-list browser checks
  passed; 52 unit tests across 12 files passed; Astro check passed for 76 files.
- Registry coverage is now 53 of 76 direct component names, with 23 remaining
  plus provider hooks. Neither registry coverage nor fixture results establish
  full prop compatibility or visual parity. All three previous 30-page visual
  runs still fail parity; final runs remain required after remaining migration.

## Bottom navigation and WhatsApp

- Added native bottom navigation with existing link resolution, first label/icon
  slots, fixed positioning and shared mobile/tablet/desktop/hover CSS compilation.
  Its label visibility follows the legacy nested `item.content.show_label` lookup;
  changing this to the schema's top-level flag would alter existing behavior.
- Added WhatsApp as a native link, preserving phone normalization, tooltip,
  green floating button, icon and `_blank`/`noopener` behavior. The legacy unused
  size prop remains unused. No provider script or React runtime is required.
- The network-enabled fixture build includes fetched SVG icons. Browser checks
  pass for breakpoint height overrides at 375/768/1280, fixed placement, links,
  WhatsApp normalization/attributes/color, plus the existing fixture coverage.
  Astro check passes for 78 files. Registry coverage: 55/76 direct component names.
- Full migration remains incomplete. Third-party integrations, other missing
  components, server/preview paths, and visual differences remain open.

## Speech synthesis

- Added native speech buttons with first-trigger presentation, section/full-page
  text selection, locale voice choice (German fallback), start/cancel toggling,
  completion/error reset and owned-utterance cancellation on unmount. Trigger
  click behavior takes precedence over configured links/actions, as in legacy.
- Restored `enable__speech` markers on headlines and rich-text paragraphs and
  trailing button icons, including the active speech indicator.
- Verification: 56 unit tests across 13 files pass; browser fixture confirms
  rendered text collection and start/stop using a mocked speech engine; fixture
  build and Astro check (80 files) pass. Real speech output was not exercised.
- Coverage is 56/76 direct legacy registrations. Remaining components, server
  paths/preview, full prop audit and visual parity are still unfinished.

## HubSpot embeds

- Migrated forms and meetings to native Astro containers and browser controllers.
  Form region/portal/form/target options and meeting name/embed URL semantics
  remain unchanged. The meeting renderer exposes the existing disableEmbed prop.
- A document-owned script loader shares pending/loaded scripts across form
  instances and removes failed scripts for retry on a later mount. Dialog
  remounts recreate forms without re-fetching the shared provider script; late
  completion cannot create a form in an unmounted container. Meetings keep a
  distinct script invocation per mount, matching their existing provider scan.
- 61 unit tests across 15 files pass. Browser fixtures pass with intercepted
  provider scripts for two form instances, meeting markup, and two dialog opens.
  No real HubSpot forms or bookings were submitted. Live provider rendering still
  needs integration/visual verification. Fixture build and Astro check (83 files)
  pass; direct registry coverage is 58/76. Full migration remains unfinished.

## Standalone accordion and swiper items

- Extracted reusable native item renderers and registered `accordion_item` and
  `swiper_item` directly. Parents reuse these components with their options;
  standalone dispatch uses defaults. Accordion details preserve the content
  width wrapper and native named-group exclusivity.
- Swiper images now use fill positioning matching the existing Next image
  contract, with Astro/Storyblok responsive transforms and intrinsic source
  dimensions. Previously they incorrectly occupied normal document flow.
- Browser checks pass for grouped/standalone accordions, square styling,
  standalone slide content, 300x150 image fill geometry and responsive srcset.
  The square option needed DaisyUI's radius variable because its collapse rules
  occupy a later CSS layer; increasing specificity alone did not fix it.
- Fixture build and Astro check (85 files) pass. Direct registry coverage is
  60/76. Full component prop parity, remaining server paths and visual parity
  remain incomplete; previous full-site visual failures are not resolved by
  these focused checks.

## Standalone card items and detail drawers

- Registered `card_list_item` with default parent options. Added missing CMS
  action dispatch to card action areas and native button semantics for actions.
- Cards with body content now open a native right-hand detail drawer, overriding
  link/action behavior as in legacy. Drawer headline/body blocks, configurable
  desktop width (420px default), full mobile width, padding, close behavior and
  focus restoration use the shared native dialog lifecycle.
- Browser fixtures pass at 375/1280 for drawer dimensions, right anchoring,
  title/body rendering, link precedence and focus return. Linked standalone
  cards and existing dynamic story-list checks pass. Fixture build and Astro
  check (85 files) pass. Registry coverage is 61/76.
- Full card presentation parity is not established: remaining options such as
  shadow effects still need auditing, alongside the remaining components,
  server/preview paths and full-site visual differences.

## Card shadow effects

- Added all seven legacy card-list shadow effects as framework-independent CSS,
  retaining their exact hover transforms, shadows and transition timings.
- Card elevation now supplies a CSS variable instead of an inline box-shadow;
  shadow effects can therefore override elevation and change on hover. Effects
  without an initial shadow (bouncy) retain the configured elevation at rest.
- Unit comparison checks all definitions against the legacy rules. The browser
  fixture verifies the soft effect's resting shadow overrides elevation 8 and
  its hover transform/shadow reaches the expected values.
- 62 unit tests across 16 files, browser fixtures, fixture build and Astro check
  pass. Coverage remains 61/76; component prop audits, missing renderers,
  server/preview migration and full-site visual parity remain unfinished.

## News detail rendering

- Added the news page renderer with the existing synthesized section/row/column,
  image, title, localized date/category, introduction, rich text and additional
  body blocks. Date-format options are copied before the existing date helper
  processes them, avoiding mutation of shared CMS content during rendering.
- Head style collection now includes the synthesized default news column so
  document-level CSS collection does not suppress its grid sizing rules.
- 63 unit tests across 17 files pass, including generated-column collection.
  Browser fixtures pass for news heading/date/article content and layout. The
  grid reference assertion now scopes to its original section, since news adds
  another independent section. Fixture build and Astro check (86 files) pass.
- Direct registry coverage is 62/76; full migration and final visual parity are
  still incomplete.

## Scrolling gallery

- Added the gallery's rotated horizontal image rows with native HTML and Astro
  images. Row gaps, per-image bottom spacing, proportional configured height,
  alt text and image styles retain their existing CMS inputs.
- Row movement uses the existing parallax engine directly, with opposite
  translateX ranges for scroll direction. Controllers and image-load listeners
  are cleaned up on page/dialog unmount.
- Image-style rules are collected in the document head even though their CMS
  field is `image_style`, rather than a regular block's `styles` field.
- Browser checks pass for proportional 200x100 images, custom 10px radius,
  12px gaps and opposite row movement on scrolling. Fixture build and Astro
  check (87 files) pass. Direct registry coverage is 63/76; full prop/visual
  parity and the remaining server/preview work are not complete.

## Intentionally disabled Instagram components

- The authoritative legacy registry assigns both Instagram component names to
  `() => null`. Astro now preserves that explicit disabled behavior rather than
  throwing an unmigrated-component error. No provider UI or scripts are added.
- The registry audit now records `intentionallyDisabled` separately. Its 65/76
  dispatch count includes these two disabled registrations; it must not be read
  as 65 active integrations or a behavioral parity result.
- Strict fixture build, empty-output browser assertion and Astro check pass.
  Eleven direct registrations remain missing, alongside provider hooks,
  incomplete prop audits, server/preview work and full-site visual differences.

## Native chat widgets

- Added Tawk and Facebook controllers with eager/first-scroll loading, preview
  suppression, account configuration and document-owned shared scripts. Retained
  Facebook's existing v8.0 initialization and SDK element ID; this is a migration
  of the current contract, not verification that the provider still supports it.
- Unmount cancels pending scroll listeners, restores the Facebook callback when
  owned by this instance, and hides existing provider widgets. No React runtime
  is involved in these controllers.
- 66 unit tests across 18 files pass, including preview suppression and lazy
  unmount behavior. Browser fixtures pass with mocked provider scripts and verify
  the Facebook options/page ID. No real chat requests were initiated. Fixture
  build and Astro check (89 files) pass.
- Registry dispatch is 67/76, including two deliberately disabled Instagram
  names. Nine registrations, provider hooks, prop/server/preview audits and
  full-site visual parity remain incomplete.

## Event detail renderer

- Added event detail rendering with centered title/date typography, image alt
  text, rich text and appended CMS body blocks. Multiple dates take precedence
  over the single date and preserve line breaks; existing date/range/all-day
  formatting and locale handling are reused with copied format options.
- Head style collection includes the event's synthesized default column, as
  for news. The separate interactive event calendar remains unmigrated.
- 67 unit tests across 18 files pass. Browser fixtures verify multiple localized
  dates, centered headings, pre-line rendering and appended content. Fixture
  build and Astro check (90 files) pass. Registry dispatch is 68/76, including
  two disabled integrations. Full migration and visual parity remain incomplete.

## Timeline and timeline items

- Added native timeline/item renderers with alternating/left/right desktop
  positioning, mobile left placement and duplicated opposite content, dot
  variants/colors, connectors, card/link/body/header options and final-line
  visibility. Standalone item dispatch has default options.
- Added one-way viewport-midpoint connector fill using IntersectionObserver and
  scroll animation frames. Final visible connector completion starts the same
  reward engine/effects through a framework-independent vendored entrypoint;
  its MIT license is retained. Unmount cancels observers, frames and active reward.
- Browser fixtures pass for desktop/mobile layout, opposite content, naked dots,
  connector fill and completion canvas creation. The fixture needs trailing
  space for its last connector to cross the midpoint; production thresholds
  were not changed to accommodate the test. Fixture build and Astro check
  (93 files) pass. Full visual/prop parity still needs auditing.
- Registry dispatch is 70/76 (two disabled Instagram names included). Auth,
  ecommerce and calendar registrations, provider hooks, server/preview paths
  and final visual parity remain incomplete.

## FastSpring migration in progress

- Added a framework-independent provider store for product/currency updates,
  immutable trigger price substitution, checkout product/user-tag payloads,
  analytics events, purchase callbacks and post-checkout redirects.
- Added the native browser adapter with the same SDK attributes and named
  callbacks, registered before script insertion. The document shares one SDK
  load. Guest redirects use full navigation; authenticated completion retains
  the `/refetch` server refresh contract.
- 73 unit tests across 20 files pass, using mocked SDK calls only. Tests cover
  text-only/missing products, cancellation, user tags, guest/authenticated
  redirects, and callback installation before SDK loading. Astro check passes
  for 94 files.
- This is not yet an integrated checkout: trigger rendering, document provider
  wiring and native authentication state still need implementation. Ecommerce
  registrations remain missing in the audit. No real checkout was started.

## FastSpring guest rendering

- Added native FastSpring product trigger templates and document provider wiring
  from public ecommerce settings. Product callbacks reveal/update triggers;
  placeholders are replaced in text nodes and accessible labels, never HTML.
- The generic ecommerce checkout dispatches its FastSpring integration with the
  first configured trigger. Native click handling takes precedence over trigger
  links/actions; text-only products do not start checkout. Unsupported provider
  components still go through strict dispatch rather than silently succeeding.
- Browser fixtures pass with a fully mocked SDK: initial price, updated price,
  markup-like price escaping, guest product/tag payload, and text-only behavior.
  No real checkout was initiated. Fixture build and Astro check (97 files) pass.
- Authentication state is NOT wired to the document provider yet; real user tags
  and authenticated refresh flows need integration with the pending auth/server
  migration. Shopify and calendar remain missing. Dispatch coverage is 72/76,
  including two disabled Instagram names, not evidence of full prop/flow parity.

## Shopify state migration in progress

- Added framework-independent variant/cart state, decimal totals, duplicate-add
  behavior, zero-quantity cleanup on cart close, analytics and checkout payloads.
  Checkout failures propagate for the UI's existing retry flow. Legacy analytics
  timing on quantity changes is retained, including the previous cart total.
- Added a native browser adapter using the existing GraphQL SDK contract with
  explicit public storefront configuration and a native checkout link. No real
  SDK request or checkout navigation is made by tests.
- 79 unit tests across 22 files pass; Astro check passes for 98 files. Tests cover
  selected-variant fallback, cart quantities, failed-checkout retry, empty carts,
  subscriptions, explicit SDK config and native-link navigation via mocks.
- Product/carousel/options rendering, cart UI, document configuration and server
  data integration remain to be wired. The Shopify registration remains missing;
  this is not a completed Shopify migration or a verified live provider flow.

- Added native Shopify product-description presentation using the existing HTML
  sanitizer and CMS trigger renderer. The dialog retains the theme text color,
  mobile/desktop toolbar sizing, Escape/backdrop closure and focus restoration.
  It is exercised in the fixture; connection to the full product is still pending.
- Astro check passes for 99 files. The full fixture browser script passes,
  including product-description opening/reopening at 375 and 1280 pixels,
  retained rich markup, stripped unsafe scripts/attributes/URLs and focus return.
  The fixture includes bottom clearance for its fixed navigation so these checks
  use normal pointer clicks. Build and diff checks pass. The build still reports
  an existing large-chunk warning; this is not full-site visual acceptance.

## Shopify product rendering and server enrichment

- Registered `ecommerce_shopify_checkout` with native responsive product columns,
  Astro images, a vanilla Swiper carousel, CMS-configured title/price/buttons,
  variant selection, compare-at prices, description dialog and checkout retry UI.
  Variant selection keeps prices, active button styling and carousel in sync;
  swapping active/inactive presentations preserves keyboard focus. The legacy
  array-spread behavior for `product_variant_name` is retained (its configured
  array did not override the original default heading).
- Astro invokes the existing Shopify enrichment helper when settings configure
  that integration, retaining consumer-supplied product data when present. No
  React registration import is required. The existing SDK endpoint and checkout
  payload remain unchanged; live Shopify API availability is not established.
- Verification: 82 tests across 23 files pass; Astro check passes for 101 files;
  fixture build and full browser regression script pass. New browser checks cover
  configured 4/8 desktop columns and mobile stacking, image height, title props,
  variant price/compare-price changes, focus, carousel wrap-around, cart payload
  and failed checkout retries. Checkout HTTP requests are mocked, with no real
  purchase. A DaisyUI rule overriding the hidden error alert was fixed.
- Dispatch coverage is now 73/76 (including two intentionally disabled Instagram
  blocks), but Shopify is not complete: the cart drawer/floating cart, document
  provider lifecycle, remaining prop/visual audits and browser SDK boundary
  cleanup remain. Auth, calendar, SSR preview, remaining server-path migration,
  package-boundary cleanup and full-site visual acceptance are still outstanding.

## Native Shopify cart

- Added the document-level cart with a native modal drawer, floating cart button,
  quantity badge, Astro-rendered product thumbnails, CMS toolbar/footer/checkout
  configuration, totals, quantity inputs and increment/decrement controls.
  The drawer uses the existing 400px desktop/full-width mobile behavior and theme
  palette. Zero-quantity rows remain until close, then disappear from the store.
- Cart checkout shares the migrated store and unchanged SDK payload. Errors reset
  on close, buttons disable while pending or empty, and reopening retains cart
  items. Escape, outside clicks, close buttons and history changes close the cart;
  unmount removes listeners/subscriptions. Focus returns to the opening control,
  including the floating button that is hidden while the drawer is open.
- Full browser fixture regression passes, including quantity edits, computed
  totals, zero-item cleanup, 375/1280px drawer widths, floating badge/reopening,
  mocked checkout failure, retry and focus restoration. All 82 unit tests pass;
  Astro check reports 103 files with no diagnostics. Build and diff checks pass.
- Shopify still needs exhaustive CMS-prop/visual auditing and browser SDK boundary
  cleanup. This does not close the overall migration: auth/calendar, SSR preview,
  remaining server paths/package boundaries and final three-site visual tests
  remain outstanding. Existing visual failures have not been accepted or waived.

## Calendar data migration in progress

- Extracted framework-independent event occurrences, expiry handling, category
  color fallback, configured view selection, local calendar ranges and navigation
  into the shared package. Parent/extra occurrence order is compared directly
  against the legacy parser, including its parent occurrence alongside extra dates.
- Calendar-day arithmetic uses local date setters rather than fixed millisecond
  increments. Explicit European locales start weeks on Monday; English and the
  legacy missing-locale fallback start on Sunday. Month navigation clamps at the
  target month's end; agenda ranges cover 30 days.
- All 89 unit tests across 24 files pass. The calendar renderer remains missing;
  these helpers do not count as completed component dispatch. Native month/week/
  day/agenda presentation, view navigation and full-screen event details still
  require implementation and browser verification. No calendar UI dependency
  or React island was introduced.

## FullCalendar integration (user-requested)

- Replaced the hand-built calendar grid and overlap renderer with FullCalendar
  7.1.3's vanilla integration, using daygrid, timegrid and list plugins. Removed
  the unused custom date-range/navigation helpers and their implementation tests.
  The shared CMS occurrence, expiry, title/color and allowed-view mapping remains.
- Kept a DaisyUI toolbar, CMS locales and scroll time, configured initial/allowed
  views, category/event colors, and native full-screen Astro event details.
  Agenda preserves legacy 30-day navigation and its inclusive final display day.
  Mount/unmount initializes and destroys the library instance and toolbar listeners.
- Dependencies: `fullcalendar` and `temporal-polyfill` are pinned in the Astro
  package. The vanilla package uses Preact internally; this was disclosed when
  adopting the user's requested library. No React adapter or Astro React islands
  were added. Source: https://fullcalendar.io/docs/vanilla-js .
- 86 tests across 24 files pass (three obsolete custom date-grid tests removed).
  Astro check passes for 105 files; fixture build and browser checks pass for
  view navigation/switching, expiry, event colors, full-screen details and focus
  restoration. Full site visual parity and remaining component/server migration
  are still outstanding. Registry coverage is 74/76 including two disabled
  Instagram names; auth_container/auth_form are the remaining missing dispatches.

## Server API migration (authentication deferred by request)

- The user explicitly asked to skip Auth0/authentication for now. No auth renderer,
  SDK or authentication flow was changed. Those two dispatches are deferred, not
  completed. The existing static-build guard against protected routes remains.
- Added a separate `astro.server.config.mjs` and `src-server/pages` tree using the
  official Node adapter. Public `astro.config.mjs` still produces static pages;
  the API/preview service builds to `dist/<site>-server`. CMS preview is not yet
  implemented in that service.
- Migrated `/api/form-endpoint` to native Request/Response handling, preserving
  echoed JSON fields, caller statusMessage override, URL-encoded arrays, origin
  whitelist and preflight behavior. Malformed JSON returns 400; missing/null body
  returns 404. Node request bodies retain the prior 1 MiB default limit.
- The server service disables Astro's generic origin check so the route's existing
  CORS policy can handle cross-origin URL-encoded requests. A real local HTTP test
  caught the prior 403 and now passes. This service currently has only the form
  API; future state-changing preview routes need their own request validation.
- Verification: 90 tests across 25 files, server Astro check (107 files), server
  build, isolated standalone HTTP checks and diff checks pass. All HTTP bodies
  are local fixtures, with no real form submission. API/preview runtime setup does
  not prove full server migration; feeds, sitemap, preview/cache endpoints and
  final three-site visual acceptance remain outstanding.
- Commands: `pnpm --filter lumen-cms-astro build --config astro.server.config.mjs`
  then `node scripts/check-astro-server.cjs` for the fixture server. Site-specific
  builds can pass `--config astro.server.config.mjs` through `scripts/astro-site.cjs`.

## Sitemap and RSS server routes

- Added native Astro `/api/sitemap` and `/api/feed/[...tag]` routes with shared
  Request/Response handlers. Sitemap preserves excluded substrings, automatic
  demo-content exclusion, home priorities, URL deduplication, hostname override,
  field-level locale stripping, domain-mapped hook locale, global/additional
  consumer hooks and existing cache headers. The sitemap stream listener starts
  before writes so stream failures are handled during asynchronous hooks.
- RSS retains comma-joined tag filters, excluded CMS fields, source item order,
  publication/creation date fallback, latest build date, metadata and existing
  host-relative links/content serialization. XML escaping and CDATA splitting
  prevent special characters from producing invalid XML. Its existing empty
  language and object-content serialization are retained, not silently redesigned.
- The shared package now declares its direct sitemap dependency. No Next request
  or response types/runtime are used in these handlers. Core delivery helpers are
  still imported from the root and remain part of the package-boundary work.
- Verification: 96 tests across 27 files pass, server check passes for 109 files,
  server build and diff checks pass. Standalone service smoke tests also pass;
  those HTTP checks exercise the form API, while sitemap/feed tests use fixture
  delivery dependencies. Live CMS XML responses have not yet been validated.
  Authentication remains deferred; preview/cache routes and final three-site
  visual acceptance remain outstanding.

## Preview sessions, SSR entry, and cache route

- Added native `/api/preview`, `/api/exit-preview` and `/api/clear-cache` routes.
  Preview entry preserves the existing CMS link secret, with a deployment override
  via `LUMEN_PREVIEW_SECRET`, and establishes an Astro server-side preview session.
  Its HTTP-only cookie uses Secure/SameSite=None for the Storyblok iframe. Entry
  rotates the session ID; exit removes the preview flag and redirects to the
  public `LUMEN_SITE_URL` when configured. Redirect paths remain on the intended
  origin, including slash/backslash/control-character inputs.
- Added an SSR catch-all in the separate preview server. It rejects requests
  without an active preview session, renders draft content through the existing
  loader, and forwards `_storyblok_release` as per-request fetch metadata. Draft
  responses are private/no-store and noindex. Auth0/application authentication
  remains deferred; CMS preview sessions are separate from that deferred work.
- Cache clearing calls both existing cache helpers and retains its response.
  All six core API handlers now have Astro route equivalents, but this does not
  prove full server/data-loader migration or deployment equivalence.
- Verification: 104 tests across 28 files pass; server check passes for 113 files;
  server build, diff check and standalone HTTP tests pass. HTTP checks cover bad
  tokens, preview cookie flags, release-query redirect, exit revocation/public-site
  redirect, unauthenticated draft gating and cache clearing. No live draft CMS
  request was made. Live preview rendering, Storyblok editor bridge/selection,
  package-boundary cleanup and final three-site visual acceptance remain pending.

### Official Astro SDK preview integration

- Followed https://www.storyblok.com/docs/libraries/js/astro-sdk: enabled the
  official integration on the SSR preview server with `useCustomApi` and
  `livePreview`. Public static configuration remains separate. Bridge relation
  and link resolution match the existing delivery API settings.
- The preview route reads `getPayload` and passes matching unsaved page/global
  content into the existing enrichment pipeline. Release metadata, fonts and
  consumer hooks are reapplied. Unrelated stories and non-preview payloads are
  ignored. Existing preview session gating remains in place.
- 107 tests across 28 files pass, including three new SDK payload regressions;
  server Astro check and build pass. This is integration groundwork, not live
  editor acceptance: block selection, native widget lifecycle, news/event live
  payloads and CSS updates still require implementation/verification.
- In particular, the installed SDK morphs only the response body and preserves
  existing element attributes. Our head-generated theme/breakpoint CSS and
  changed class/style attributes need explicit handling before claiming identical
  editor behavior. The three-site visual acceptance remains outstanding.

### Preview CSS and native widget lifecycle

- Added a handler for the SDK's cancelable `storyblok-live-preview-updating`
  event. It posts the SDK payload to the preview route and replaces server-owned
  theme/font/breakpoint/custom CSS as well as body markup. Changed class/style
  attributes and deleted custom CSS now update instead of retaining stale values.
- Native widgets dispose through `astro:before-swap` and initialize through
  `astro:page-load`. Newly introduced component module scripts load once before
  remounting; JSON configuration scripts remain in the rendered body. Failed
  requests retain the current page, superseded responses are ignored, and errors
  emit `lumen:preview-error`. Scroll position is restored after replacement.
- Block dispatch now uses official `storyblokEditable` attributes via inert
  markers, matching the legacy strategy without adding layout wrappers. The page
  main element receives its attributes directly. Selection markers do not share
  the actual `data-blok-uid`, avoiding duplicate bridge targets.
- Added live payload handling for matching news and event stories. Regression
  coverage now includes unsaved page/global/news/event content, CSS replacement,
  widget cleanup/remount, stale responses, failed requests, new module loading,
  and wrapper-free editor selection: 116 tests across 30 files pass.
- Live Storyblok iframe acceptance and browser-level preview interaction remain
  unverified. Full-body updates intentionally remount widget state; preserving
  active widget state across edits requires further parity review. Directly
  rendered blocks outside the central dispatcher also need selection auditing.
  The full migration and three-site visual acceptance are not complete.

### Refreshed three-site visual sample (2026-11-02, 12:41–12:46 UTC)

Built 30 published routes per site and compared at 1280px and 375px: all 180
local/live pairs returned HTTP 200, but all 180 fail the zero-difference gate.
No screenshots or differences were accepted. Median static changed pixels:

| Site | Desktop | Mobile | Report directory under `.website-tests/results` |
| --- | ---: | ---: | --- |
| Baliinternships | 25.59% | 34.24% | `bali/2026-11-02T12-43-23-417Z-6d1e49` |
| planet.training | 19.23% | 32.41% | `planet/2026-11-02T12-41-41-177Z-ef107a` |
| Upskill | 22.88% | 37.08% | `upskill/2026-11-02T12-42-14-698Z-60894d` |

- Added `scripts/serve-astro-site.cjs <site> <port>` to host independent static
  builds without directory redirects. An earlier Bali run using Python's default
  server introduced artificial trailing slashes; the table uses the corrected run.
- Screenshot and DOM inspection identified missing default-button color
  inheritance in colored sections. Added the legacy default-color marker and
  section inheritance rules, plus explicit inherited button colors. DaisyUI
  variants occupy the utilities layer, so these rules use that layer; unlayered
  custom CMS CSS remains authoritative. This fix is newer than these reports.
  Rebuilt all 30 Bali routes and verified in Chromium that all 17 footer buttons
  inherit white text and the language button border is white. Verification image:
  `.website-tests/results/bali/footer-color-fixed.png`. Astro check and diff check
  pass. Temporary visual-test servers were stopped after verification.
- Follow-up priorities: header/search widths, button dimensions/weight, FAQ and
  article-list layouts, Upskill announcement styling, and mobile page heights.
  Some broken-image flags compare the same unavailable Storyblok asset with a
  normalized versus double-slash URL; these need classification rather than
  assuming every flag is a new missing asset. Live iframe failures remain visible.

### Acceptance clarification and shared header/button corrections

- User clarified that pixel-perfect matching is not required. Screenshot diffs
  remain review evidence, not a zero-difference release gate. Acceptance requires
  recognizable structure, fonts/colors, responsive behavior, complete content,
  working interactions/submissions, and unchanged CMS editing semantics. Minor
  spacing differences can be accepted after visual review; missing controls,
  broken layouts/content and functional failures cannot. Earlier zero-threshold
  failure counts must not be interpreted as 180 functionally broken pages.
- Removed the block-level search-wrapper behavior that could wrap the header.
  Restored default header button color inheritance and the legacy button font,
  height, padding, shadow, size variants and icon-slot spacing using CSS layered
  above DaisyUI defaults and below custom CMS rules.
- Intermediate focused three-page comparison: traineeship desktop changed pixels
  reduced from 2.00% to 0.77%, with matching screenshot height. Fees desktop reduced
  from 11.53% to 8.97%. Homepage desktop increased from roughly 25% to 28%; this
  still needs visual review rather than assuming every shared change improves it.
  Report: `bali/2026-11-02T12-51-16-126Z-b6f489`. Subsequent icon-slot corrections
  are newer than that report. Unit suite remains 116 passing tests, Astro check
  passes for 115 files, and the three-page static build passes.

### DaisyUI navigation

- Following the user's navbar direction, adopted DaisyUI `navbar`, `dropdown`,
  `dropdown-content`, and `menu` markup. Custom CMS block menus use a wide
  mega-menu panel; simple link menus use semantic lists. Existing CMS links,
  alignment, custom triggers, hover options and mobile drawer variants remain.
- Native keyboard/ARIA behavior controls opening and dismissal. Explicit hidden
  panel styling prevents DaisyUI focus-within from reopening a dismissed menu;
  its closing animation remains enabled. Document/window listeners now abort
  when a menu unmounts in preview.
- Added `scripts/check-astro-navbar.cjs` for keyboard open/Escape/focus return,
  viewport containment, retained links, and mobile drawer opening/closing.
  Persistent drawers close with their toggle, matching their configured behavior;
  modal drawers close with Escape. All five Bali dropdowns (including custom CMS
  content) and the persistent mobile drawer pass. Visual inspection prompted
  compact panels for one-column content; grouped/multi-column menus retain the
  wide mega-menu layout. Other sites' multi-column layouts still need review.
- Browser measurements after the final icon-slot adjustment match production's
  tested registration button width/height and menu-trigger height. Pixel-perfect
  matching is not an acceptance requirement; these checks diagnosed the header
  wrapping and inherited DaisyUI sizing regressions.

### FAQ and article-list review

- Reviewed the first 1700px of local/live FAQ and article-list screenshots. The
  article list retains the same stories and two-column structure; small row-height
  differences accumulate over its roughly 56,000px page, inflating the full-page
  pixel score. This is not evidence of missing article content.
- Corrected DaisyUI cascade conflicts in native-details accordions: compact
  closed rows, right-aligned indicators, grouped corners, square variants, and
  expanded content spacing. Native exclusive-group semantics remain intact.
- Restored native `hidden` behavior globally so component display utilities cannot
  reveal empty-state controls, clear buttons or closed panels. `hidden=until-found`
  is excluded from this rule to preserve its separate browser semantics.
- Expanded the browser fixture checks to cover closed/open content visibility and
  summary height. The full interactive suite passes across six grid widths, with
  exclusive/standalone accordion behavior, square variants and other existing
  interaction checks retained. All 116 unit tests and Astro check pass.
- Actual Bali sample verification: FAQ mouse/keyboard expansion and mobile layout
  pass (48px closed summaries, indicators 16px from the edge, no horizontal
  overflow). Article search filters 30 visible results to 3 for “Engineering”;
  clearing restores 30 and hides the clear control. Rebuilt five Bali routes.
  Screenshot: `.website-tests/results/bali/faq-mobile-fixed.png`.

### Framework-independent SEO/head metadata

- Added shared metadata and JSON-LD generators without Next/React/next-seo
  runtime imports. Astro now renders the legacy page/site title and description
  precedence, robots switches, canonical normalization, Open Graph images and
  fallbacks, Facebook ID precedence, Twitter fields, Google verification, PWA
  meta fields and favicon variants. Preview pages are always noindex/nofollow.
- Added organization/logo, product/offers, social profile, local business/address/
  coordinates/opening hours, and corporate contact JSON-LD. Page blocks override
  site blocks. Inline JSON escapes script terminators without changing its value.
  Managed head markers also refresh metadata during Storyblok live updates.
- 126 tests across 31 files pass; the dependency audit includes the new helper.
  Astro check passes for 116 files; both static and standalone server builds pass.
  Parsed generated HTML for five Bali routes and verified canonical URLs, robots,
  social titles, favicons and parseable JSON-LD. No external analytics were fired
  by this head-metadata work.
- Remaining head work includes tracking integrations, custom script strategies,
  and the PWA manifest link/deployment path. The full migration remains active.

### Custom CMS script strategies

- Replaced Next Script usage for settings-provided scripts with native Astro
  output and a document-owned loader. `beforeInteractive` scripts render in the
  initial head; default/`afterInteractive` scripts initialize after document
  parsing; `lazyOnload` waits for load and an idle callback (timer fallback).
- Preserved explicit IDs, CMS UID fallback, URLs versus inline bodies and custom
  attributes. Attribute values retain embedded equals signs. Config JSON escapes
  script terminators, while browser-created inline scripts receive the original
  script text. Custom scripts remain enabled in preview as in the legacy head.
- IDs and external URLs deduplicate across initialization/live-preview remounts.
  Failed external loads emit `lumen:script-error` and can retry on initialization.
  Early scripts are recognized as already executed; they do not rerun on input.
- 131 tests across 32 files pass. Added real Chromium fixture coverage for early,
  interactive, external and idle execution, nonce forwarding, duplicate URLs and
  repeated page-load initialization. Full interactive suite and Astro checks pass;
  static fixture and standalone server builds pass. Only harmless local scripts
  were used for execution verification, with no analytics events submitted.
- Tracking integration bootstraps and PWA manifest handling remain outstanding.

### Tracking and consumer public assets

- Added native-script bootstraps for Facebook Pixel, AdRoll, Google Analytics and
  Google Tag Manager, retaining configured IDs and event queues. Tracking is
  disabled outside production and in CMS preview. Mocked execution verifies the
  queues and generated URLs without sending analytics events.
- Restored the conditional PWA manifest link. Consumers still supply the actual
  manifest; this does not add a service worker or offline behavior.
- Astro copies the consumer public directory when run through `astro-site.cjs`,
  with `LUMEN_PUBLIC_DIR` as an override and core public assets as the fallback.
  Verified the generated Bali favicon matches its consumer file byte for byte.
- All 134 tests across 33 files pass, and the standalone server build passes.
  Inspected the generated Bali homepage script configuration without executing it.
- Before further browser visual runs, isolate analytics requests: the current
  visual runner restricts top-level navigation but does not block analytics.
  Live Storyblok editor verification, remaining component prop coverage and final
  three-site visual review are still outstanding.

### Button prop parity and visual-run analytics isolation

- Restored button custom colors for contained/floating backgrounds and
  text/outlined foregrounds and borders, label alignment, and configured avatar
  image sizes (including the legacy size fallbacks). Button images now use Astro
  Image. Custom CSS remains above these defaults in the cascade.
- Added browser assertions at all six fixture widths for color/alignment/image
  size and mobile/tablet/desktop/hover custom-style precedence. The first run
  caught a default-grey foreground conflict; fixed it and reran successfully.
  The full interaction fixture suite passes. Astro check reports zero diagnostics
  across 118 files; the static build passes with icons fetched successfully.
- The visual runner now intercepts the migrated analytics providers on both
  sides of comparisons, returning empty responses instead of executing provider
  scripts or sending pixel requests. Two request-classification tests pass and
  ensure CMS images and Facebook page embeds remain available. This covers the
  known tracking integrations, not arbitrary third-party custom CMS scripts.
- The next complete three-site visual run must use rebuilt consumer outputs;
  existing reports predate these button changes. Full migration acceptance is
  still pending.

### Navigation labels and animated headlines

- Navigation list headings and links now use their actual CMS labels even when
  the styling block contains its own text/mobile text, matching legacy child
  precedence. Mobile collapse media-query listeners are disposed on unmount and
  preview swaps. Headline alignment defaults now permit advanced responsive CSS
  to override alignment, as with the legacy Typography alignment prop.
- Added native count-up and countdown rendering for headline blocks dispatched
  through the registry. Count-up starts on first visibility, supports the three
  documented easing modes, duration, ascending/descending values and affixes.
  Countdown parses CMS deadlines as UTC, uses the configured interval and renders
  configured completion blocks, initializing their native controls on insertion.
  Animation frames, observers and timers are disposed on unmount.
- 136 unit tests across 34 files pass. Astro check passes for 120 files; static
  build and full Chromium fixture suite pass. Browser coverage includes navigation
  labels, desktop/mobile collapse, responsive headline alignment, count-up final
  values and expired/active countdown output across six widths.
- Direct Headline uses inside other components still require audit against their
  legacy Core versus animated renderer choice. This and broader prop parity,
  live preview acceptance and final consumer visual review remain outstanding.

### Updated 30-page consumer comparison

- Added a shared CMS headline dispatcher for normal versus animated rendering;
  card title/subtitle/description and date headlines now follow the same choice
  as their legacy renderer. Navigation item typography remains the core renderer.
  Astro check passes across 121 files with zero diagnostics.
- Rebuilt 30 published routes per consumer and completed desktop/mobile captures
  for all 90 routes (180 cases). Every local/live response was HTTP 200 and no
  local capture had horizontal overflow. Known analytics providers were blocked
  on both sides.
- Reports (under `.website-tests/results/`):
  - `bali/2026-11-02-counter-audit/report.html`
  - `planet/2026-11-02-counter-audit/report.html`
  - `upskill/2026-11-02-counter-audit/report.html`
- Median static changed pixels: Bali 18.21% desktop / 33.11% mobile;
  planet.training 16.09% / 30.22%; Upskill 20.59% / 31.53%. The runner retains its
  zero-pixel threshold and labels all 180 as failed. These labels are review
  signals, not a claim that all pages are functionally broken or that zero-pixel
  parity is still required.
- Inspected Bali homepage mobile crops: main content and structure are present;
  spacing/line wrapping and feature-header icon colors differ. Long article-list
  pages remain high-difference cases. Upskill announcement styling also needs
  review. Extra browser errors observed on map pages are Google iframe sandbox
  access errors; Astro uses the current legacy branch's same sandbox helper.
- Builds report missing legacy icon names using the same CDN lookup as Next;
  those have not been silently replaced. Remaining acceptance includes full prop
  coverage, live Storyblok editor verification, package boundary cleanup and
  visual review/fixes; this run does not complete the migration.

### Header appearance and lifecycle parity

- Restored the dark toolbar background/foreground, default primary toolbar color,
  explicit zero elevation, configured button font size and bold toolbar text.
  Feature headers now apply their white control color to native drawer/search
  buttons as well as CMS buttons, preserving the scrolled toolbar state.
- Header scroll listeners are removed on preview swaps and content unmount.
  Added a header browser fixture covering dark/white appearance, zero shadow,
  font settings, feature controls, the 60px scroll transition and disposal.
- Astro check passes for 121 files; the static fixture build and full browser
  interaction suite pass. The prior three-site reports predate this header fix.
- Rebuilt all 30 Bali routes and verified the actual homepage at 375px/1280px:
  visible drawer/search controls are white before scrolling and the feature class
  clears after scrolling. Saved `bali/header-feature-fixed.png` in the results
  directory. Known analytics were suppressed and the temporary server stopped.

### Shared link resolution

- Moved link resolution into a framework-independent shared helper with explicit
  routing configuration. Astro components, rich text, story results and sitemap
  now use a small environment adapter instead of importing the legacy link helper
  and its React-oriented configuration/registry module.
- Preserved the legacy behavior for root directories, locale suppression,
  field-level translations, anchors, external targets, assets/downloads, email,
  telephone conversion and link validity. Compatibility tests compare outputs
  against the legacy implementation under each routing configuration. The legacy
  renderer remains unchanged as the comparison baseline.
- All 139 tests across 35 files pass. A bundle assertion proves this resolver
  consists only of the Astro adapter and shared helper. Astro server check passes
  across 122 files; standalone build and local API checks pass. Broader server
  data helpers and CMS types still import from the core repository, so package
  independence is not yet complete.

### Not-found page behavior

- Audited the six core Next API paths against their Astro counterparts. Added the
  missing public `404.html` with the legacy “not found...” message and noindex
  metadata. The local static comparison server now serves this artifact with a
  404 status for absent files.
- Missing CMS page/settings and legacy reserved slugs (`_dev_`, `[object Object]`)
  are distinguished from delivery failures. Authorized preview requests return
  404 HTML with private/no-store and noindex headers; unexpected delivery failures
  remain errors. Preview session gating is unchanged. Static builds still fail
  visibly if an enumerated page cannot be loaded.
- 142 tests across 35 files pass; Astro server check passes for 124 files.
  Static and standalone builds pass. Standalone HTTP checks cover authorized
  reserved-slug 404 responses and existing API contracts without real CMS calls.
  Verified the generated `404.html` message and metadata.
- Core auth-related logout/refetch paths remain intentionally deferred with Auth0.
  Optional `src/travel/api` extension exports were identified during the audit;
  their Astro equivalents and consumer registration still need evaluation.

### Optional travel API adapters

- Added optional Astro `travelApi`, `travelsApi`, `travelCategoriesApi` and
  `createTravelSitemapHook` exports. The three reference consumers have no travel
  API registrations; these exports do not add endpoints to their core service.
  Consumers retain control of their existing API path names.
- Shared Web Request/Response helpers retain detail/list JSON, detail 404s,
  one-hour shared-cache headers, locale precedence, category relationship filters
  and sitemap URL prefix/date/priority. Existing GraphQL query functions remain
  the data source. Backend failures propagate to Astro rather than leaving the
  legacy list endpoint without a completed response.
- Consumer registration examples:
  ```ts
  // src/pages/api/travel.ts (use the consumer's existing path)
  export { travelApi as ALL } from 'lumen-cms-astro/server/travel'
  // Likewise: travelsApi and travelCategoriesApi in their respective route files.
  ```
  ```ts
  // src/pages/api/sitemap.ts
  import { createSitemapApi } from 'lumen-cms-astro/server/sitemap'
  import { createTravelSitemapHook } from 'lumen-cms-astro/server/travel'
  export const ALL = createSitemapApi([createTravelSitemapHook()])
  ```
- All 146 tests across 36 files pass; Astro check passes across 125 files.
  Tests use local fixture data and verify filters, outputs and sitemap integration;
  the handler bundle contains no Next/React/MUI runtime. No travel backend request
  was sent. Travel GraphQL helpers/types still reside in the core repository and
  need extraction for standalone package distribution. This does not establish
  parity for the optional travel React UI.

### Tabs responsive layout and keyboard visibility

- Restored centered-tab behavior only above the configured mobile breakpoint.
  Vertical layouts preserve numeric tab/content widths, flex-growing content and
  full-width stacking below 600px. Styled tab titles now use the CMS headline
  dispatcher, including configured counter behavior.
- Keyboard navigation scrolls the selected tab into view when the tab list
  overflows. Existing selection, inert panels and orientation behavior remain
  covered by the browser fixture.
- The interrupted check revealed invalid test data: the current CMS schema allows
  `true` only for content width, not tab-list width. Corrected the fixture to use
  a three-column list and flexible content; no schema widening was introduced.
- Approval review is available again after the earlier usage-limit failure.
  Astro check passes across 125 files, the static build passes, and the full
  Chromium interaction suite passes including mobile/desktop tab sizing and
  keyboard overflow checks. These fixes postdate the latest three-site reports.

### Further prop audit: notifications, avatars, timeline and forms

- Snackbar now preserves explicit zero elevation and zero-day cookie expiry,
  cancels delayed show/close timers and scroll listeners on unmount, and prevents
  linked dismissal controls from navigating. Added mocked-timer lifecycle tests.
- Corrected named avatar letter/icon font sizes to the legacy size map and fixed
  outlined timeline dots emitting a boolean instead of their palette color.
- Native form textareas now grow from `rows` to `max_rows`, scroll at the maximum,
  shrink after clearing/reset and remeasure after width changes. Observers and
  listeners are removed on unmount. Swiper now forwards dynamic pagination bullet
  limits; its image fit option was already delegated to SwiperItem.
- All 149 unit tests pass. Astro check passes across 127 files; static build and
  full Chromium interaction suite pass, including textarea row limits, dynamic
  pagination configuration, avatar metrics and zero-elevation snackbar rendering.
  A tab overflow test now waits for responsive layout after resizing before
  pressing End, eliminating an assertion against the previous media-query state.
- Compared the saved Upskill announcement signatures: the deck, fonts, sizes,
  weights and colors match; the signature difference is `start` versus `left`
  text alignment on an LTR page. This does not establish a visible style defect.
- The reference consumers' app entrypoints all re-export LmDefaultApp without
  custom registrations. The broader remaining prop audit is not yet certified
  complete. Per the latest instruction, rerun all three 30-page visual suites
  after that audit and its fixes, not before.

- A schema-to-renderer scan was used only to identify candidates for manual
  review, not as a parity certificate. Several apparent omissions are delegated
  to child components or are unused by the legacy renderer (for example image
  list fit/label options and Swiper image fit). No schema fields were removed.
  Remaining review should include extension/override contracts and preview
  behavior before describing the migration as complete.

### Native Astro renderer extensions and app wrappers

- `Document.astro` accepts per-render `components` and `wrappers` props. Nested
  blocks inherit the override map through `RenderContext`; adjacent renders with
  a different context retain their defaults. No mutable global registry is used.
- App wrappers render outermost-first, receive `settings` and `context`, and place
  page content with `<slot />`. An empty list emits no wrapper elements. Existing
  FastSpring/Shopify initialization remains in the document's wrapped content.
- Consumer Astro route example (with its existing page loader):

  ```astro
  ---
  import Document from 'lumen-cms-astro/Document.astro'
  import CustomHeadline from '../components/CustomHeadline.astro'
  import SiteWrapper from '../components/SiteWrapper.astro'
  const page = await loadPage(/* consumer route inputs */)
  ---
  <Document page={page} components={{ headline: CustomHeadline }} wrappers={[SiteWrapper]} />
  ```

  Custom block components receive `content`, `context`, `direction` and
  `sectionPosition`. Wrappers use native Astro rendering/scripts; React context
  providers must be ported, not passed to this API. These extension props are
  supplied by a consumer route; they are not read from CMS content.
- This implements block-dispatch replacement and wrapper composition. It does
  not yet certify overrides of all directly rendered child fields or the legacy
  `lm_link_render` hook. Live Storyblok editor acceptance also remains open.
- Fixed Bali summer-school tab browser-default borders/background and preserved
  icon block height even when an SVG is absent. The actual page passes desktop
  and mobile tab switching/overflow checks; its four desktop headings align.
- Validation: 149 unit tests pass; Astro check reports zero diagnostics across
  132 files; static and standalone server builds pass; local server API checks
  and the full Chromium fixture suite pass. Browser assertions cover nested
  wrapper order/settings/context, no-wrapper passthrough and isolated nested
  component overrides. Grid comparisons now target their named section rather
  than whichever unrelated section happens to render first.

### Local autocomplete navigation outside the visual sample

- Reproduced six real Bali search results returning 404 while the local dev server
  was launched with `--sample`. Search reads the full published CMS inventory,
  but the catch-all route previously accepted only the 30 visual sample paths.
- Development now enumerates the full published route inventory and renders
  requested pages on demand; sample builds/inventories remain limited. The site
  runner explains this when `dev --sample` is used.
- Full route enumeration also includes noindex pages. The existing listing helper
  applies a sitemap-style noindex filter by default; without Next's fallback,
  that incorrectly made published thank-you pages unavailable. This change is
  limited to route enumeration; sitemap filtering and robots metadata remain.
- The same six result URLs now return 200. Astro check passes across 132 files.

### Search and paginated-list route normalization

- Search-result and dynamically rendered story-list links now use the public
  route generator's mapping, including `/home` to `/`, locale home paths,
  configured default locales, root directories and suppressed locale prefixes.
  Search/list components pass their actual page locale configuration to the
  browser. This closes a second 404 source after the development sample fix.
- Added routing regressions for development navigation beyond a sample,
  noindex route inclusion, sample build limits and canonical home destinations.
  All 159 unit tests pass and Astro check has zero diagnostics across 132 files.
  The static fixture build passes. General CMS link override contracts and final
  three-site visual acceptance remain outstanding.

### Consistent CMS story-link destinations

- The Astro link adapter now opts into the public route policy for all CMS story
  links, so buttons, cards, navigation and rich text use the same canonical paths
  as search and static route generation. Queries and anchors survive mapping;
  external URLs, email/asset links and target attributes retain their behavior.
- The shared link helper keeps its legacy behavior unless the caller explicitly
  supplies `publicRoutes`; legacy compatibility tests still pass. No React/Next/MUI
  modules enter the link bundle. The route mapping dependency is framework-free.
- All 161 unit tests pass; Astro check reports zero diagnostics across 132 files,
  and the static fixture build passes. Remaining renderer override/prop audits,
  live editor acceptance and the final three-site visual rerun remain open.

### Nested headline dispatch

- `CmsHeadline` now honors the per-render headline override before selecting
  animated/default rendering, and forwards explicit slot content to overrides.
  Navigation-list headers, news-list typography and Shopify product/cart headings
  now use this dispatcher, as their legacy counterparts use component rendering.
- Navigation item labels still use the base headline renderer, matching the
  legacy NavItem's direct `LmHeadlineCore` call. Counter internals also retain the
  base renderer to avoid recursive dispatch.
- Browser fixtures verify nested card overrides, navigation slot precedence,
  override precedence over counters and default rich slot content. Astro check
  has zero diagnostics across 132 files; static build and the full Chromium
  interaction suite pass, including existing mocked Shopify interactions.
- Other direct child renderer calls and the link-render extension hook still
  need auditing. This does not establish full extension or prop parity.

### Nested button and form-field dispatch

- Added a native `CmsButton` dispatcher for configured buttons inside toolbar,
  search, speech, Google/native forms and Shopify. Overrides receive render
  context, button type, disabled state and slot content; default buttons retain
  their styling, data hooks and native submission behavior.
- FormBuilder now sends fields through Block with its form options, allowing
  field renderer overrides while preserving default variant/margin/width options.
  Browser fixtures cover overridden required/name fields, option forwarding,
  submit/disabled props and slot forwarding.
- Astro check passes across 135 files and the static fixture build passes. The
  submission test selects the visible form so the hidden override fixture cannot
  make its success-state assertion ambiguous.

### Native link renderer extension

- `Document` accepts `linkRenderer={CustomLink}` and propagates it through the
  render context. `CmsAnchor` forwards native anchor attributes and slot content
  to that Astro component; without an override it emits a plain anchor and never
  serializes the context object into HTML. `AstroLinkProps` is exported through
  the package context entrypoint for consumer link components.
- Wired the extension into CMS links, linked buttons/cards/timeline items,
  navigation/drawer links, bottom navigation, image lists, news/story lists and
  the toolbar logo. Non-link button/div/li branches keep their native elements.
  Custom link components must forward the supplied attributes and slot to an
  anchor to retain browser navigation and existing widget event hooks.
- Corrected toolbar logo destinations from `/home` and `/locale/home` to the
  public `/` and `/locale` routes. Browser fixtures verify the logo, canonical
  link paths, target/rel/classes, rich slot content and override isolation.
- Astro check passes across 137 files; static build and the full Chromium fixture
  suite pass. Rich-text links produced by the string renderer still need the
  extension integrated; live editor and final three-site visual acceptance remain.

### Native rich-text link rendering

- Rich-text editor content and initial news descriptions now render through
  recursive Astro components, allowing `linkRenderer` to replace links within
  nested formatting while preserving the existing supported nodes and marks.
  Markdown paragraphs retain their established Markdown parser.
- Default output is compared against the shared string renderer's DOM for
  headings, nested marks, links/targets/anchors, styled text, lists, blockquotes,
  code, images, unknown nodes and empty paragraphs. The comparison caught and
  fixed a numeric zero emitted by an empty-container conditional.
- The existing image-attribute allowlist and escaped text behavior are retained;
  custom link slots preserve nested bold/italic content. This remains native
  server rendering without React or MUI.
- Astro check passes across 139 files and static build passes. Client-created
  rich-text descriptions in paginated lists still use the shared string renderer;
  their custom-link behavior remains to be addressed, alongside the remaining
  migration audit, live editor acceptance and final three-site visual rerun.

### Custom rich-text links in fetched list descriptions

- ListStories renders same-window and new-window link shells when a custom link
  renderer is configured. Fetched descriptions bind destinations into those
  shells and replace the content slot with formatted DOM nodes. Custom classes,
  surrounding markup and data attributes survive; URLs are assigned as attribute
  values rather than interpolated into HTML. Native links remain unchanged when
  no override is supplied.
- Added unit coverage for template reuse, nested formatting, targets/downloads
  and dynamic attribute binding. The paginated-list browser fixture verifies an
  actual fetched description uses the custom link, `/de` home route, query/anchor,
  target and bold text, alongside the existing pagination/retry/history checks.
- 163 unit tests pass; static build passes. This uses the existing static-template
  contract for client-created list content: arbitrary server-only component logic
  that branches on each fetched URL is not re-executed in the browser. That broader
  extension constraint remains unproven; do not claim unrestricted override parity.

### Inline SVG image prop parity

- Image's inline-SVG branch now retains CMS class names and shape property
  classes, applies configured corner radius/circular clipping, and exposes the
  same alt label as an accessible image. Previously those fields were retained
  only on the raster branch, so CMS class-based styling could disappear for SVGs.
- Added a rendered SVG fixture covering custom classes, circle shape, dimensions,
  color, clipping and accessible name. Astro check passes across 140 files and
  the static fixture build passes.
- Checked image-list column breakpoints against the legacy implementation: the
  desktop column transition at `lg`/1280 is intentional, not a layout omission.

### News/event route inventory and standalone inventory CLI

- Full public route enumeration now requests `page,news,event`, rather than only
  `page`. News/event detail renderers already existed, but static builds have no
  Next fallback to recover omitted detail paths. The explicit visual sample list
  remains unchanged; global/settings and other configuration stories are excluded.
- The inventory CLI's esbuild bundle now defines `import.meta.env.DEV` as false.
  Without Vite supplying that expression, evaluating sample route selection in
  the CommonJS inventory runtime could fail. A real one-page Bali inventory run
  passed after the fix; the full 30-page Bali sample refresh also completed.
- Regression tests include standalone news/event paths and noindex pages alongside
  sample-build limits. All 163 unit tests pass and Astro check reports zero
  diagnostics across 140 files.

### Calendar default culture

- Restored the legacy German calendar culture when `language` is omitted. The
  same resolved locale now determines the week start, so an unconfigured calendar
  starts on Monday rather than the migration's accidental English/Sunday default.
  Explicit supported language values continue to select their FullCalendar locale.
- The existing calendar fixture now omits the language and checks that its first
  displayed date is a Monday; it still exercises view switching, navigation,
  expired-event exclusion, event colors and event-detail dialogs. Static build
  passes. This is a behavior-preserving default correction, not a CMS schema change.

### Responsive image-list download sizes

- Matched image `sizes` hints to the actual image-list layout: tablet columns
  remain active until 1280px, and phone sizing honors the general column count
  and masonry fallback. Previously the hints switched at 900px and could select
  a smaller image than the rendered tablet column needed. Lightbox images retain
  their full-viewport hint. Layout dimensions and CMS fields are unchanged.
- Astro check passes across 140 files and `git diff --check` is clean.

### Three-site visual rerun — 3 November 2026

- Rebuilt each site's 30-page sample after the routing, tabs, icon-height and
  renderer changes, then compared all 90 routes at 1280px and 375px (180 cases).
  Every local and live capture returned HTTP 200; no horizontal overflow was
  recorded. All 163 unit tests passed before this run.
- Reports (relative to repository root):
  - Bali: `.website-tests/results/bali/2026-11-02T23-52-00-079Z-f928ad/report.html`
  - Planet: `.website-tests/results/planet/2026-11-02T23-52-20-085Z-0986d1/report.html`
  - Upskill: `.website-tests/results/upskill/2026-11-02T23-52-42-663Z-dfb89f/report.html`
- Median static changed pixels, desktop/mobile: Bali 18.63%/33.79%, Planet
  15.85%/30.98%, Upskill 18.88%/29.43%. All 180 cases fail the configured zero
  pixel tolerance. These are review measurements, not visual acceptance passes.
- Inspected homepage mobile crops: remaining differences include compressed
  vertical spacing/secondary text colors on Planet and 16px versus 32px content
  gutters on Bali. Upskill announcement/chat timing also affects comparisons.
- Planet drawing-tool broken-image warnings refer to an asset broken on both
  sides, with a double-slash URL difference. Bali German home has two broken
  image assets locally at both sizes and live on mobile; the desktop discrepancy
  still needs investigation. Do not blanket-dismiss broken-image warnings.
- Turtle-conservation heading differences include inactive tab content and live
  carousel headings; they need visibility-aware inspection. Upskill contact also
  logged an embedded Google iframe sandbox error. The existing sandbox policy
  has not been relaxed.
- This run completes the requested capture rerun, not migration acceptance.
  Remaining visual issues, live Storyblok editor acceptance, package boundaries
  and arbitrary server-only logic in client-created override templates remain
  open. Auth remains intentionally deferred.

### Rich-text palette color prop

- Restored `rich_text_editor.color`, which the Astro paragraph renderer omitted.
  Legacy text aliases, palette paths and literal CSS colors now resolve against
  the site's theme. Explicit custom colors still apply inline; advanced CMS CSS
  retains its existing `!important` priority. Plain markdown remains inherited.
- Added browser fixtures for secondary text, primary palette paths, advanced
  styles, custom colors and their precedence. The complete interactive fixture
  passes at all six responsive widths. Static fixture build passes and Astro
  check reports zero diagnostics across 140 files.
- The earlier three-site screenshots predate this correction; their reported
  pixel metrics remain the baseline, not measurements of this new change.
- Section container padding matches the current legacy implementation in the
  six-width geometry fixture. The observed live Bali gutter difference therefore
  needs page-specific investigation rather than a blanket container adjustment.

### Background presets and shadow effects

- Restored section `presetVariant` fallback and legacy slider `section_variant`
  forwarding. Explicit section variants still win; preset-only variants do not
  enable the form-color flag, matching the legacy renderer.
- Background `shadow_effect` now applies to sections (outer and container), rows,
  columns, standalone cards and the navigation drawer. Rows/columns retain the
  required wrapper when the shadow is the only background setting. Drawer CMS
  background class names are also preserved.
- Standalone card elevation now provides a CSS fallback rather than an inline
  shadow that blocked shadow effects. Explicit background elevation and corner
  radius retain their legacy precedence over card defaults/square appearance.
- Added rendered checks for preset precedence, slider forwarding, shadow-only
  layout wrappers and card background precedence. Astro check passes across
  140 files, static fixture build passes, and all 163 unit tests pass.
- The full Chromium interactive fixture subsequently passed at all six widths,
  including the existing card hover animation. Its selector was narrowed to the
  intended card after the new hidden shadow fixtures exposed a global-selector
  assumption in the test. No production behavior was changed to satisfy it.

### Legacy slider control props

- Migrated `arrows_dark`, `pagination_dark`, `arrows_beside_pagination`,
  `pagination_below_content` and the legacy `pagination_circle` indicator shape.
  Native buttons live outside the clipped Swiper viewport, allowing below-content
  placement. Hide flags retain the legacy relationship between side arrows and
  pagination arrows. Active indicators expose `aria-current`.
- Legacy sliders now wrap at their boundaries via Swiper rewind, retain autoplay
  after interaction, preserve the default pause-on-hover behavior, use the legacy
  500ms transition duration, and reset slide text alignment to the left. Modern
  Swiper CMS blocks retain their separate control path.
- Added an interactive fixture with three section slides and checks for control
  position/color/shape, slide selection and forward/backward boundary wrapping.
  Astro check passes across 140 files and the static fixture build passes.
- Full Chromium fixture passes, including modern swiper/product-carousel checks
  and legacy control navigation. The gallery comparison now waits for the initial
  scroll animation frame before measuring its baseline; without that wait it
  could compare the subsequent scroll against a stale transform. Production
  gallery behavior and the directional assertion remain unchanged.
- The three-site visual reports predate this control migration and remain the
  earlier baseline. Final visual acceptance and the broader migration audit are
  still open.

### Swiper effect layout parity

- Restored effect-specific layouts: cards use 240×320px with visible rounded
  slide edges, cube uses a centered 300px square, coverflow uses centered 300px
  slides with vertical padding, and creative centers slide content and applies
  the legacy ±120%/−500 transition offsets.
- Responsive slide-count/spacing settings now apply only to the same default
  and fade paths as the legacy renderer; coverflow retains automatic slide width.
  Cube shadow parameters are explicit. Effect CSS is scoped and unlayered so
  Swiper's own unlayered stylesheet cannot suppress the migrated overrides.
- Added six rendered effect fixtures and navigation/dimension assertions. Astro
  check passes across 140 files and the static fixture build passes.
- The full Chromium fixture passed, including navigation for cards, cube,
  coverflow, creative, fade and flip. Fade is exercised with one visible slide;
  the initially supplied three-visible-slides fixture disabled navigation by
  exposing all slides and was corrected. This does not certify arbitrary
  combinations of multi-slide counts with single-slide effects.
- These effect changes are newer than the last three-site screenshot run; final
  visual acceptance remains open.

### Collection item renderer overrides

- Swiper, card lists, accordions and timelines now dispatch their nested items
  through the component registry. Previously direct rendering bypassed consumer
  overrides for `swiper_item`, `card_list_item`, `accordion_item` and
  `timeline_item`, despite those registrations being accepted at the top level.
- Block dispatch forwards the parent options with a typed union; each built-in
  renderer receives only its relevant option type. Accordion style classes and
  timeline `isLast` are forwarded to both custom and default renderers. Existing
  form-builder option forwarding is retained.
- Added an integration fixture asserting all four custom item renderers receive
  the actual parent settings and item identity. Static fixture build passes and
  Astro check reports zero diagnostics across 141 files. This restores server
  dispatch; it does not remove the previously documented limitations of arbitrary
  server-only logic in client-generated list templates.
- The full browser fixture and paginated story-list suite pass. Timeline checks
  now target the animated fixture explicitly rather than assuming a single
  timeline; custom override fixtures add a second timeline. These checks also
  exercise the built-in item paths, navigation, forms and responsive layout.

### Image-list item overrides and lightbox lifecycle

- Image-list items now use registry dispatch when a render context is present,
  forwarding the legacy `listProps` contract to custom item renderers. Built-in
  items still receive those settings as their internal options; standalone
  rendering without a context retains its default behavior. The lightbox keeps
  its dedicated media renderer, matching the legacy distinction.
- Lightbox navigation wraps at either boundary. On page/content unmount, the
  native dialog closes and its Swiper instance is destroyed, avoiding retained
  carousel listeners when preview content is replaced.
- Added checks for custom item identity/aspect ratio/fit color, forward/backward
  wrapping, and disposal of an open lightbox. Static fixture build passes and
  Astro check reports zero diagnostics across 142 files.
- Full Chromium fixture passes, including open-dialog unmount cleanup and both
  navigation boundaries. Navigation assertions wait for each transition before
  reversing direction; rapid mid-transition reversal is not certified by these
  checks. The three-site visual reports predate these changes.

### Public server entrypoints and standalone revalidation

- Exposed `lumen-cms-astro/server/pages` (`loadPage`, `staticRoutes`) and public
  handler entrypoints for `preview`, `exit-preview`, `clear-cache`,
  `form-endpoint` and `feed`. The existing `server/sitemap` and optional
  `server/travel` exports remain available. Consumer apps can register their
  route files without depending on this package's internal source paths:

  ```ts
  // Consumer src/pages/api/form-endpoint.ts, with a server adapter configured.
  export const prerender = false
  export { ALL } from 'lumen-cms-astro/server/form-endpoint'
  ```

  The same pattern applies to the other handlers at their existing paths;
  feed uses `src/pages/api/feed/[...tag].ts`. Preview handlers require Astro
  sessions and the iframe-compatible cookie settings demonstrated in
  `astro.server.config.mjs`. This does not enable Auth0 or publish protected pages.
- A new bundle test imports the page loader and all six core handlers through
  package exports and verifies their dependency graph excludes Next, React,
  MUI and Emotion runtime code. All 164 unit tests pass.
- Rebuilt the standalone server after the recent component changes. Local API
  checks pass for JSON/form requests, CORS preflight, preview secret handling,
  secure session cookies, redirects, reserved-path 404s and cache clearing.
  These checks do not claim live Storyblok iframe acceptance or independent
  publication of packages that still share root-source utilities.

### Referenced form renderer dispatch

- `form_container` now sends its resolved form through registry dispatch, matching
  the legacy container. Custom `form_builder` renderers receive the referenced
  content plus container-level `additional_fields` and `success_message`.
- Direct/default form-builder dispatch forwards those same extension props;
  existing merging, endpoint requests and native submit events are unchanged.
- Added fixtures for custom dispatch and default rendering, including container
  precedence over referenced hidden-field values and success text. Static build
  passes and Astro check reports zero diagnostics across 143 files.
- Reviewed static-section/static-container relation traversal: the current Astro
  paths already dispatch their children and preserve classes/empty references,
  so no change was needed there.
- Full Chromium fixture passes, including mocked native submissions and the new
  referenced-form assertions. Final three-site visual acceptance remains open.

### Updated three-site visual baseline — 3 November, 08:20 WITA

- Rebuilt all three 30-page samples after the color, background, slider/effect,
  collection override and referenced-form changes. Completed 180 comparisons
  (90 routes at 1280px and 375px). All captures returned HTTP 200, with no
  horizontal overflow. The temporary comparison servers were stopped afterward.
- Reports:
  - Bali: `.website-tests/results/bali/2026-11-03T00-20-21-182Z-3f28e0/report.html`
  - Planet: `.website-tests/results/planet/2026-11-03T00-20-40-929Z-0e1383/report.html`
  - Upskill: `.website-tests/results/upskill/2026-11-03T00-20-55-909Z-0f1d55/report.html`
- Median static changed pixels, desktop/mobile: Bali 18.63%/33.79%, Planet
  15.76%/30.40%, Upskill 18.86%/29.14%. Every case fails the configured zero
  pixel tolerance; these results do not certify visual acceptance. Planet's
  desktop `/support` capture reported unloaded fonts and needs a targeted retry.
- Inspected Planet homepage mobile crops and live/local computed styles. The
  live grid supplies 16px below the main heading and 16px above its paragraph;
  Astro resolves both margins to zero. The grid child-margin rules are in the
  components cascade layer, whereas generated typography resets are unlayered.
  This explains the missing 32px separation and identifies the next correction.
  No source changes were made during the comparison run.
- Unavailable icon names logged by Bali use the same lookup/mapping in the
  legacy renderer; they are not established migration-only failures. Existing
  search geometry, broken-image and external embed warnings remain review items.

### Restored grid text margins

- Moved only the generated typography margin reset into the components cascade
  layer. Grid child selectors can now supply their legacy 16px margins (8px in
  stacked columns), while explicit CMS styles retain their existing precedence.
  Font sizes/families and responsive typography rules are unchanged.
- Corrected grid trailing-child selectors from `:last-of-type` to the legacy
  `:last-child`. Mixed heading/paragraph children no longer lose their bottom
  margin just because they are the final element of that tag type.
- Added rendered mixed-content assertions at six widths, covering first/last
  children and stacked versus regular columns. Full browser fixture, all 164
  unit tests, Astro check and static build pass. Rebuilt Planet for a focused
  homepage/support comparison; the earlier 180-case report predates this fix.
- Focused comparisons completed for Planet homepage and `/support` at 1280px
  and 375px: all eight local/live captures returned 200 with loaded fonts, no
  browser errors and no horizontal overflow. The previous support font failure
  did not recur. Artifacts: `.website-tests/grid-spacing-2026-11-03/results/`.
- Inspected mobile homepage crops: the hero heading-to-paragraph separation,
  trust row and CTA positions now align with live. Lower-page spacing and total
  heights still differ, so this is not full-page visual acceptance. The focused
  runner reports geometry differences and does not supply a comparable full-page
  changed-pixel percentage for these unequal-height captures.

### Tab panel alignment and carousel behavior

- Tab slide content now resets inherited alignment to left, as the legacy
  carousel does; child blocks can still apply their own alignment. Centered
  parent columns no longer inadvertently center all tab content.
- Restored tab-carousel boundary wrapping through Swiper rewind and the legacy
  500ms transition duration. Selection and inert-panel state continue to update
  from slide changes and keyboard navigation.
- Extended tab fixtures with a centered parent and fixed list/content widths,
  alongside existing growing-content and scrollable keyboard cases. The CMS
  schema permits `true` for content width, not tab-list width; no unsupported
  tab-list option was added. Astro check and static fixture build pass.
- Full Chromium fixture passes, including tab boundary selection at all six
  layout widths and fixed-width/alignment checks at mobile and desktop sizes.
  Current three-site screenshots predate this tab correction.

### Card description limits and responsive image hints

- Preserved the legacy distinction between numeric `0` (hide description) and
  string `"0"` (truncation), including negative and omitted limits. Card dispatch
  now uses the renderer's actual options type.
- Card image `sizes` follows the configured phone/tablet/desktop column counts
  at the existing 600px and 1920px grid breakpoints.
- Astro check passes across 143 files; static fixture build, all 164 unit tests
  and the full Chromium fixture at six viewport widths pass. Browser assertions
  cover description limits and the generated image hint.

### Color-only backgrounds and grid spacing

- Compared Upskill mobile homepage DOM geometry against production. A color-only
  column background emitted an empty `.lm-background-images` div in Astro.
  That changed `:first-of-type` matching and added 16px above the hero stack,
  then another 16px above the study-program heading. Production has no image
  node for these backgrounds; CMS padding/margins otherwise matched.
- Background now emits its image container only when an image exists. Gradient
  and other background-element layers retain their separate rendering.
- Extended the six-width grid fixture with color-only backgrounds and assertions
  for absent image containers and zero top margin on the stack. Astro check and
  fixture build pass. The full Chromium fixture also passes at all six widths.
- The three 30-page visual runs started at 08:37 WITA use pre-fix static output;
  the source correction does not change those already-built comparison inputs.
- Rebuilt Upskill after its baseline run completed. Live/local mobile heading
  positions now match exactly: hero subtitle y=324.71875, section heading
  y=835.75, study-program heading y=1328.921875. Before this fix the local
  positions were respectively +16px, +16px and +32px. This verifies the actual
  page correction, not full-page visual acceptance.

### Three-site visual rerun — 3 November, 08:37 WITA

- Completed 30 routes at two widths for each site (180 comparison cases).
  Reports:
  - Bali: `.website-tests/results/bali/2026-11-03T00-37-41-096Z-8dcd19/report.html`
  - Planet: `.website-tests/results/planet/2026-11-03T00-37-41-208Z-2267f4/report.html`
  - Upskill: `.website-tests/results/upskill/2026-11-03T00-37-40-514Z-dc516e/report.html`
- Median static changed pixels desktop/mobile: Bali 15.34%/27.93%, Planet
  16.29%/29.57%, Upskill 17.94%/26.11%. All cases fail the zero-pixel threshold;
  one Planet desktop basketball case timed out navigating production. Its
  separate retry at both widths returned 200, with no errors or overflow:
  `.website-tests/background-spacing-2026-11-03/planet-retry/`.
- All other baseline captures returned 200 and no horizontal overflow. Reports
  retain outstanding search geometry, external broken images, long article-list
  spacing and Google embed sandbox errors. The iframe policy was not relaxed.
- These baseline builds include grid text margins, tab alignment/rewind and card
  description/image hints, but predate the empty background-container fix above.
  The latter has fixture and actual Upskill homepage verification separately.
- Audited legacy `/refetch` and `/logout`: both are Auth0-only and remain within
  the user's explicit authentication deferral. Full prop completeness and live
  Storyblok editor acceptance remain unproven; the migration goal stays active.

### Linked article-card spacing

- Compared settled Bali article-card geometry with production. Native linked
  card content received the generic last-child 24px bottom padding, whereas
  MUI's action wrapper keeps it at 16px. Added an action-only rule; inert cards
  keep their 24px bottom padding.
- Added linked/inert fixture assertions at all six widths. The full Chromium
  fixture passes; Astro check and static fixture/Bali sample builds pass.
- Verified the first three cards on the rebuilt Bali article page against live:
  top positions 188/188/678.28125px, heights 434.28125/466.28125/434.28125px,
  media heights 268.3125px and bottom padding 16px all match exactly.
- Development-server reloads interrupted early measurements, so the confirmed
  results above use static output after fonts and sidebar layout settle.
- Focused full-page desktop/mobile captures completed in
  `.website-tests/card-spacing-2026-11-03/results/`. Earlier 180-case reports
  predate this correction.

- Focused article captures: desktop heights 56192px local / 56175px live
  (17px difference, down from 929px in the previous baseline); mobile
  95756px / 95755px (1px difference). Both widths returned 200 with no
  browser errors or horizontal overflow. Unequal image dimensions mean the
  focused runner provides no changed-pixel percentage; this is not a claim
  that the page is pixel-identical.
- Next audit findings: the plain `lists` layout currently fixes avatars to
  50px instead of applying `image_size`; dynamic card templates also remove
  numeric-zero description limits. These remain to be corrected and verified.

### Plain-list avatar sizes and dynamic zero-description limits

- Plain story lists now honor `image_size`: xsmall 20px, small/medium 24px,
  large/default 52px and xlarge 56px, matching the legacy avatar mapping.
  Replaced their raw image elements with Astro Image and the existing Storyblok
  service; fetched results preserve the rendered size and responsive image URLs.
- Card templates now retain numeric `0` description limits, so a fetch no longer
  restores descriptions that were hidden in initial HTML. String `"0"` remains
  truncation to `..`, preserving the legacy distinction.
- Added browser assertions before and after a mocked search fetch for every
  documented avatar size, image `sizes`/`srcset`, and both zero-limit variants.
  All six size cases pass in Chromium, along with pagination, search, retry,
  stale-response and custom-link checks. All 164 unit tests, Astro check and
  static fixture build pass.
- The schema's `render_as_links` and `two_line` flags are not read by the legacy
  plain-list renderer either; no new behavior was invented for those fields.

### Generated list and nested navigation overrides

- Generated card/navigation layouts now go through Block's component registry,
  matching the legacy list adapters. Block forwards `disablePagination` to both
  custom and default card-list renderers. Generated card items retain the source
  `story_data` image metadata for consumer overrides.
- NavList now dispatches each child through Block and passes its configured
  headline options. Default NavLink rendering receives those options too.
- Added fixtures for custom card/nav layouts, both pagination flag values,
  generated story metadata and a nested custom nav item. The six-width browser
  fixture and existing list suite pass; Astro check passes across 145 files and
  the static fixture builds successfully.
- The fetched-result custom nav-item check also passes, preserving its style
  options after search updates. Dynamic
  overrides still use pre-rendered templates: custom items must preserve the
  list-item binding marker, and custom layouts must preserve their result
  container. Arbitrary server-only logic cannot rerun on newly fetched stories;
  broad dynamic override parity remains open.

### Menu initial state and explicit zero values

- Added the legacy `initialOpen` renderer prop to Block and NavMenu, including
  forwarding to custom overrides. Native menus initialize their open state and
  ARIA expanded state from it without stealing focus.
- Corrected menu elevation fallback: the CMS string `"0"` now selects no shadow
  instead of falling back to elevation 8. The six-width browser fixture passes
  initial-state and shadow assertions alongside existing keyboard navigation.
- Google Form submit spacing now preserves an explicit `fields_gap: "0"` for
  both inline and stacked layouts, matching legacy submit-button styles. Field
  spacing semantics and submission code are unchanged.
- Astro check passes across 145 files and the static fixture build passes.
  The full six-width browser fixture passes, including zero-gap layouts and
  mocked Google Form submission. The latest three-site reports predate
  these prop fixes.

### Card asset download attributes

- Standalone cards and card-list items now forward the link adapter's `download`
  attribute. Previously they retained href/target/rel but dropped this asset-link
  behavior. Native and custom link renderers receive the same attribute.
- Drawer cards continue to suppress link/download attributes and open their
  drawer when content is present, matching the legacy action precedence.
- Added six-width browser assertions for both card types, both link renderers,
  and the drawer exception without initiating a real download. Astro check
  passes across 145 files, the static fixture build passes, and the full browser
  fixture passes at all six widths.
- Reviewed image-list ratios, fit wrappers, label-position precedence and
  gallery image sizing against the legacy renderer; no new discrepancy was
  established in those paths during this pass.

### Native optional travel detail, list and search

- Added native Astro travel detail, list and search-box exports. Detail renders
  header, overview/booking, gallery, services and team with native blocks and
  Astro images. Synthetic CMS sections collect their own breakpoint styles.
- Pure detail/list content builders are compared against the legacy React
  renderer's exact CMS output in English and German. Their browser bundle
  dependency graphs contain no React, Next, MUI or Emotion runtime imports.
  List option objects are copied before removing their generated body.
- Travel lists retain localized detail destinations, custom card options,
  currency selection, category/text filtering, result counts and 30-card reveal.
  The search box uses DaisyUI input/select controls and the existing
  `/api/categories` parameters, aggregate option counts, 750 ms text debounce,
  clear buttons and page-local filter state. Failed category loads can retry.
  State preserves the legacy context-versus-query precedence and does not
  rewrite the URL. Browser request cancellation and unmount cleanup are native.
- All 170 unit tests pass. Astro check has zero diagnostics across 149 files;
  the static fixture build succeeds. Chromium checks pass at 375 and 1280 px
  in English and German for booking links, currency, galleries, section content,
  localized card destinations, filtering/counts, clear controls and category
  failure/retry. Existing story-list browser checks also pass.
- Optional consumers can import `lumen-cms-astro/travel/Travel.astro`,
  `lumen-cms-astro/travel/TravelList.astro` and
  `lumen-cms-astro/travel/TravelSearchBox.astro`, and pass them in Document's
  component map as `travel`, `travels_list_widget`, and `travels_search_box`.
  The search/list state replaces the React PageContextProvider; no React
  provider registration is needed. Existing travel server exports remain
  responsible for consumer data loading and category endpoints.
- This does not complete optional Auslandszeit rendering, live consumer travel
  integration, arbitrary server-only dynamic overrides, live Storyblok editor
  acceptance or the final post-migration three-site visual rerun. The latest
  three-site baseline predates this optional travel UI batch.

### Native Auslandszeit and optional server registration

- Added `lumen-cms-astro/travel/AuslandszeitList.astro` for the optional
  `auslandszeit_list_widget` renderer. Native DaisyUI cards preserve job links,
  badges, metadata, theme shadow/text color, fixed 180 px media and the legacy
  600/900 px column breakpoints. Images use Astro's image component.
- Native search retains case-insensitive matching across title, category,
  address, country and description, with a 500 ms debounce. Clear cancels a
  pending debounce and restores all cards immediately. Chromium checks pass
  at 375, 768 and 1280 px for every search field, zero results, clear, links,
  card media height, metadata, column count and overflow.
- The Astro travel server entry now exports separate `registerTravelServerHooks`
  and `registerAuslandszeitServerHooks` opt-ins plus their existing loaders.
  Core enrichment initializes before registration. Tests exercise nested page
  enrichment, locale-aware list loading and the jobs feed URL/API-key contract
  with mocked I/O; the optional server bundle contains no Next/React/MUI runtime.
- Validation: 171 unit tests pass; Astro check has zero diagnostics across
  150 files; static fixtures and the complete six-width core browser suite pass.
  Consumer travel detail route/page-data adapters and live integrations remain
  open; component exports alone do not prove full optional integration parity.

### Refreshed three-site visual baseline, November 3

- Rebuilt all three 30-page samples and ran 180 desktop/mobile comparisons.
  All 360 local/live captures returned HTTP 200; none had horizontal overflow.
  All comparisons fail the intentionally strict zero-pixel tolerance. Median
  static changed pixels (desktop/mobile): Bali 15.10%/27.03%, Planet
  9.33%/25.13%, Upskill 11.79%/17.29%. These metrics are diagnostic, not acceptance.
- Reports:
  - `.website-tests/results/bali/2026-11-03T01-12-36-210Z-e130c0/report.html`
  - `.website-tests/results/planet/2026-11-03T01-13-04-805Z-efc066/report.html`
  - `.website-tests/results/upskill/2026-11-03T01-13-30-622Z-9afe5b/report.html`
- Planet captures have no browser errors. Bali/Upskill have the known external
  Google iframe sandbox error on some pages. Broken-image flags require source
  comparison: e.g. Planet volleyball's missing image is present in both sides'
  failures but uses different transform widths and slash normalization.
- This run exposed inactive tab panels enlarging the page. Legacy MUI TabPanel
  omits inactive content; native Swiper previously included all panel content in
  height calculations. Inactive native panel bodies are now hidden, and dynamic
  height is updated after selection. A six-width regression verifies a 600 px
  inactive panel has zero layout height and appears only when selected. The
  full baseline above precedes this newly discovered correction; targeted Bali
  comparisons are being recorded separately.
- Targeted post-fix results are in `.website-tests/tabs-height-2026-11-03/`.
  Turtle conservation local/live heights are now 4435/4460 desktop and
  6682/6711 mobile (previous desktop local height 5614). Summer school heights
  are 2646/2686 desktop and 3608/3635 mobile. All four comparisons return 200
  with zero browser errors and overflow. A side-by-side screenshot inspection
  confirms the large empty tab area is gone and subsequent sections align
  closely; remaining spacing differences are still visible. These focused
  results do not replace a future complete baseline after remaining fixes.

### Native travel detail page loader and route inventory

- `lumen-cms-astro/server/travel` now exports `loadTravelPage`,
  `travelStaticRoutes`, `TravelPageOptions`, and the shared 404 error/response.
  The loader preserves the legacy settings path/locale resolution, SEO title,
  description and image fallback, synthesized travel block, font loading,
  component enrichment and page hooks. Preview release/language parameters
  remain request-local; published requests never send a preview release.
- Native route enumeration includes all configured locales in development and
  builds, supports `TRAVELS_SLUG`, and rejects ambiguous public destinations.
  It returns Astro `params`/`props` for a consumer `[...slug].astro` route.
  It does not rely on Next fallback or return Next revalidation metadata:
  static consumers rebuild these pages; SSR consumers configure deployment
  caching independently.
- Travel list destinations and route generation now share the same path helper.
  Native anchors must include the locale that Next Link used to insert: with
  English as default, German cards link to `/de/reisen/<slug>`. Configured
  prefixes and suppressed locales are handled by the same route policy.
- Example optional static consumer route (alongside its CMS route setup):

  ```astro
  ---
  import Document from 'lumen-cms-astro/Document.astro'
  import Travel from 'lumen-cms-astro/travel/Travel.astro'
  import TravelList from 'lumen-cms-astro/travel/TravelList.astro'
  import TravelSearchBox from 'lumen-cms-astro/travel/TravelSearchBox.astro'
  import { loadTravelPage, travelStaticRoutes, registerTravelServerHooks } from 'lumen-cms-astro/server/travel'
  export async function getStaticPaths() {
    return travelStaticRoutes({ defaultLocale: 'en', locales: ['en', 'de'] })
  }
  registerTravelServerHooks()
  const { travelSlug, ...options } = Astro.props
  const page = await loadTravelPage(travelSlug, options)
  ---
  <Document page={page} components={{ travel: Travel, travels_list_widget: TravelList, travels_search_box: TravelSearchBox }} />
  ```

- Unit coverage compares native loader output and settings requests directly
  against the legacy page function in both languages, checks enrichment/hooks,
  missing-trip errors, backend failures, preview isolation, development routes,
  prefixes and collisions. Native optional server bundle auditing remains in
  place. Live travel consumer integration and live CMS editor acceptance remain
  unverified; these adapter tests do not claim those acceptance gates.
- Validation for this batch: all 176 unit tests pass; Astro check reports zero
  diagnostics across 151 files; the static build succeeds; the complete
  story-list/travel/Auslandszeit browser checks pass, including corrected German
  card destinations at both tested widths. No three-site visual rerun was needed
  for these optional travel-only adapters; the latest baseline and targeted
  tab-height correction above remain the current visual evidence.

### Optional server rendering for dynamically fetched custom lists

- Added `storyListEndpoint` to Document/RenderContext and exported
  `createStoryListEndpoint` from `lumen-cms-astro/server/story-lists`. When
  configured, pagination/search fetch server-rendered Astro fragments instead
  of substituting markers in static templates. Custom layouts can branch on
  fetched data and emit arbitrary markup without the old list/container markers.
- The endpoint's `loadContext(sourcePath, apiContext)` callback must resolve the
  authorized source page and the consumer's component map on the server. The
  requested UID is looked up in that page; layout/theme/renderer configuration
  and CMS credentials are never accepted from the browser. Preview/protected
  contexts are rejected by this published-list endpoint. Missing pages/lists,
  invalid page numbers and unsupported methods have explicit responses.
- Static consumers opt in by providing a same-origin API route, for example:

  ```ts
  import { createStoryListEndpoint } from 'lumen-cms-astro/server/story-lists'
  import { loadPublicPageContext } from '../../../lib/cms-context'
  export const prerender = false
  export const ALL = createStoryListEndpoint({ loadContext: loadPublicPageContext })
  ```

  Here `loadPublicPageContext` is the consumer's page/context resolver, including
  its access policy and Astro component map. Pass that endpoint URL as
  `storyListEndpoint` on Document. A purely static host needs a server service
  for this option; ordinary built-in lists retain their existing static path.
- Result insertion dispatches content-unmount/content-mounted events. Consumer
  scripts must be loaded by the page and support the native mount contract;
  returned inline scripts are not executed. Scoped styles and a custom button
  using that contract pass in the standalone browser fixture. This is native
  Astro component integration, not automatic conversion of React overrides.
- End-to-end coverage uses a custom card layout with no binding markers that
  switches between different elements based on newly fetched titles. Initial
  load, search, pagination, empty results, failure/retry, stale responses,
  scoped CSS and button initialization pass. API validation and mount/unmount
  sequencing are covered as well. Existing static story-list, travel and jobs
  browser tests remain green.
- Validation: all 179 unit tests pass; static and standalone server builds pass.
  Live consumer endpoint integration and Storyblok editor acceptance remain
  open. No changes were made to the three sites' endpoint configuration.

### Authenticated SDK preview browser integration

- Added a fixture-only authenticated preview page using the installed SDK's
  `getPayload`, middleware, `handleStoryblokMessage` input handler and the real
  native Document renderer. The standalone browser test obtains an actual local
  preview session and sends editor-shaped requests through that complete path;
  it does not mock the fetch response or dispatch only our custom update event.
- Verified edited titles/content, desktop/mobile breakpoint CSS, deleted styles,
  editable selection attributes and a newly introduced tabs component. Tabs
  remain usable after repeated document replacement. After session revocation,
  a subsequent SDK update is rejected and the previous document remains intact.
- This strengthens the local integration evidence. It does not claim that a
  hosted Storyblok editor iframe, its external bridge handshake or a live
  consumer's settings/API connection has been exercised.

### Responsive search keyboard shortcut

- Ctrl/Cmd+K now selects a visible search trigger instead of blindly opening the
  first search instance. A hidden desktop/mobile navbar copy could previously
  capture the shortcut and open an invisible dialog. Existing handled key
  events, modifiers/composition and repeats are respected.
- Added a hidden search instance before the visible fixture and verified both
  shortcuts, including mobile/desktop switching. All six-width core browser
  checks pass; 179 unit tests pass; static and standalone server builds pass.

### Responsive CMS visibility and image margin cascade

- The German Bali homepage revealed a CSS-layer conflict: a subset of legacy
  `d-*` utilities had duplicate `!important` declarations in the components
  layer. Layered important declarations override unlayered important rules,
  so `d-none` defeated the theme's `d-md-block`, while `d-sm-block` defeated
  `d-md-none`. Removed those duplicates; the complete shared CMS display rules
  now own all breakpoints consistently.
- The same page exposed image wrappers using inline `margin: auto`. That beat
  grid stack spacing and distributed spare vertical space above/below icons in
  shorter columns. Moved the default image margin to component CSS, matching
  the legacy cascade so grid margins and explicit CMS styling can override it.
- Added six-width regressions for phone/tablet/desktop visibility combinations
  and image/heading alignment in columns with different content heights. The
  full browser fixture passes; Astro check reports zero diagnostics across
  159 files. On the actual German Bali page at 1280 px, only the desktop hero
  is visible (853.328 px high), and all three feature headings align at
  y=1578.969, matching the production capture. Ctrl+K opens a visible dialog.
- Server-route audit confirmed `/refetch` and `/logout` are Auth0 flows and stay
  deferred under the user's explicit auth exclusion. Registry dispatch remains
  74/76 with only auth_container/auth_form excluded; Instagram components were
  already disabled in the legacy renderer. Dispatch alone is not prop parity.

### Latest three-site visual run and emitted-runtime audit

- Completed 30 pages per site at desktop/mobile widths (180 comparisons,
  360 local/live captures). Every capture returned 200; none had horizontal
  overflow. Strict zero-pixel-difference checks still flag visual differences;
  these are diagnostic results, not a claim of complete visual parity.
- Reports: Bali `2026-11-03T01-38-15-279Z-c1c831`, Planet
  `2026-11-03T01-39-27-880Z-d4af8d`, Upskill
  `2026-11-03T01-40-13-040Z-254630` under `.website-tests/results/<site>/`.
- Median changed pixels, desktop/mobile: Bali 8.77%/19.25%, Planet
  9.21%/25.87%, Upskill 11.71%/17.29%. Bali's earlier baseline was
  15.10%/27.03%, before the tab-height and responsive cascade corrections.
- Browser-error cases: Bali six and Upskill three retain external Google iframe
  sandbox errors; Planet zero. These runs do not establish hosted editor or
  consumer integration acceptance.
- Added a build hook checking emitted module graphs and external imports for
  React, Next, MUI and Emotion packages. Package boundaries are checked so a
  workspace directory named `react` does not produce false positives. Preact
  used internally by FullCalendar remains allowed. Optional audit JSON is
  written outside public output. Static fixture and standalone server builds
  pass with no forbidden packages; these reports cover fixture graphs, not
  separately audited builds of all three sites.
- All 185 unit tests in 43 files pass, including audit rejection/allow cases.
  Temporary visual-test servers were stopped; the user's 4321 server remains.

### Motion visibility threshold and real-site bundle verification

- Found a behavioral gap in native motion: `isIntersecting` alone allowed an
  entrance animation below the CMS threshold. The legacy installed
  react-intersection-observer also compares `intersectionRatio` against the
  normalized threshold. Native motion now performs that same check, including
  cancelling a pending delay when visibility drops below the threshold.
- Regression tests cover below-threshold visibility, exact-threshold entry,
  delay cancellation/re-entry, trigger-once behavior and content disposal.
  All 188 tests pass; Astro check reports zero diagnostics across 160 files.
  The static fixture builds and the six-width browser suite passes.
- Rebuilt all three real 30-page site samples with the emitted-runtime audit
  enabled. Bali, Planet and Upskill builds all succeed. Each client report
  contains 315 module IDs and each prerender report 459; none contains React,
  Next, MUI or Emotion package modules/external imports. Reports are in
  `.website-tests/runtime-audit/<site>-<environment>-*.json`.
- This closes the earlier limitation of auditing only fixture bundle graphs.
  The previously recorded 180 visual comparisons precede the motion threshold
  correction; no new screenshot comparison is claimed for that small change.
  Full prop parity and hosted consumer/editor acceptance remain unproven.

### Responsive iframe prop compatibility

- Restored `embed-responsive-item` on responsive iframe elements, preserving
  the selector used by legacy CMS CSS. Responsive positioning now comes from
  the shared utility class, so explicit CMS `position` retains its original
  inline-style precedence. Removed the redundant wrapper aspect-ratio style;
  existing shared ratio utilities own sizing as in the legacy component.
- Six-width Chromium coverage verifies 16:9, 4:3, 3:2 and square ratios,
  explicit relative positioning and dimensions, full-height wrappers,
  fullscreen and provider permissions. The complete fixture suite passes.
  Astro check reports zero diagnostics across 160 files; fixture build passes.
- Audited the advanced iframe message-key fields: the legacy component does
  not consume `post_message_key` or `incoming_message_key` either. No new
  messaging behavior is invented for those unused schema fields. Native
  browser lazy loading remains the intentional replacement for the legacy
  intersection observer and loading skeleton.

### Avatar and table theme parity

- Avatar now receives the renderer context and uses the same defaults as the
  installed legacy Avatar: foreground from palette.background.default,
  grey.400 background in light mode and grey.600 in dark mode. Explicit CMS
  foreground/background and transparent image backgrounds retain precedence.
  Restored line-height 1 for matching letter alignment.
- Table borders now read palette.common.white/black rather than hard-coded
  colors, preserving consumer-provided theme values.
- New browser fixtures check dark/custom/light avatar colors and line height,
  plus a custom table border palette at all six viewport widths. Full browser
  suite passes, all 188 unit tests pass, and Astro check reports zero
  diagnostics across 160 files. Fixture build passes. These checks do not
  replace the still-open full prop/hosted integration completion audit.

### Public Astro server hook configuration

- Added `lumen-cms-astro/server/config`, exporting the shared `SSR_CONFIG` and
  its type. Consumers can now register component-data/page-data/sitemap hooks
  and form CORS domains without importing legacy repository internals.
- The entry initializes core page loaders first. The legacy loader assigns its
  default component hook map at module evaluation, so exposing configuration
  without ordering initialization could silently erase consumer registrations.
- Integration tests register a custom component loader and page hook through
  this entry, run the actual Astro page loader, and verify enriched data and
  failure propagation. Additional tests confirm sitemap hooks and form CORS
  use the same configuration. Public-entry bundle checks include this export
  and still find no Next/React/MUI/Emotion runtime dependencies.
- Usage: import a consumer-owned setup module from the server routes that need
  it (or server middleware). Register hooks once at module scope, not for each
  request. A minimal setup module is:

  ```ts
  import { SSR_CONFIG } from 'lumen-cms-astro/server/config'
  SSR_CONFIG.ssrHooks.componentData.custom_block = async (block, page) => {
    return { title: block.title, locale: page.locale }
  }
  SSR_CONFIG.corsWhitelistDomains.push('https://consumer.example')
  ```

- All 192 unit tests pass; Astro check reports zero diagnostics across 161
  files; standalone server build passes. This provides a native public setup
  path, not evidence of deployment into an external consumer application.

### Timeline theme compatibility

- Compared native timeline dots with the installed legacy TimelineDot styles.
  Default filled dots now use grey.400 backgrounds and grey.50 text rather
  than the synthetic grey.main/contrastText palette entries. Outlined dots
  inherit foreground color, matching legacy behavior, while their borders
  retain the selected primary/secondary/default color.
- Connectors now read theme grey.400, and outlined timeline cards use the
  theme divider color instead of a hard-coded light-mode border. Existing
  scroll-fill animation still overrides connector backgrounds at runtime.
- Added six-width computed-style checks for default and outlined dots and
  light/dark outlined cards. Full browser fixture passes, including animated
  connector progression and rewards. Astro check reports zero diagnostics
  across 161 files; fixture build passes. The latest full three-site visual
  report remains the earlier documented run, not a new post-change capture.

### Image-list aspect-ratio cascade and CMS selectors

- The standard-item image selector was more specific than the aspect-ratio
  image selector, leaving images at intrinsic height within a forced-ratio
  slot. Raised the ratio selector to the legacy descendant specificity so it
  wins in the intended order. Standard square slots now fill their height;
  fit-color images contain within that same slot, while masonry retains its
  natural image proportions.
- Restored the legacy `ratio-<aspect>` wrapper class for non-masonry lists so
  existing CMS CSS selectors keep matching. The native layout class remains.
- Added browser geometry assertions for cropped square, fitted square and
  masonry images at all six widths, including fit background and legacy class
  presence. Astro check reports zero diagnostics across 161 files.
- Fixture build and full six-width browser suite pass, including existing
  lightbox keyboard navigation and disposal checks. The latest three-site
  visual report still predates this correction; no new site capture claimed.

### Post-component-fix three-site visual baseline

- Rebuilt all three samples (30 pages plus 404 each) after the motion, iframe,
  avatar/table, timeline and image-list corrections. Build runtime guards pass.
  Re-ran 30 routes at 1280 and 375 px for each site, 180 comparisons total.
- Reports under `.website-tests/results/`:
  - Bali: `bali/2026-11-03T01-56-37-812Z-20eb2d/report.html`
  - Planet: `planet/2026-11-03T01-56-38-994Z-3693c7/report.html`
  - Upskill: `upskill/2026-11-03T01-56-38-884Z-a797d9/report.html`
- One Upskill production navigation timed out at 60 seconds, for the desktop
  tropical-biology route. Retried only that case, preserving original evidence:
  `upskill/2026-11-03-live-timeout-retry/`. Retry returned 200 on both sides,
  zero overflow and zero browser errors (local/live heights 10063/10110).
- All completed comparisons, including that retry, have local/live HTTP 200
  and zero horizontal overflow. Strict zero-pixel acceptance still fails all
  original comparisons. This is a diagnostic baseline, not visual acceptance.
- Median static pixel differences desktop/mobile: Bali 8.77%/19.25%, Planet
  9.21%/25.86%, Upskill 10.91%/17.29%. Upskill desktop median covers 29 cases;
  the direct retry reports geometry but not the wrapper's static pixel metric.
- Browser-error cases: Bali six, Planet zero, Upskill four, with external
  iframe issues retained in the reports. The focused retry had none.
- Investigated Planet mobile drills paragraph spacing: current local and live
  DOM both measure 311 px content width inside a 343 px column with 16 px
  padding. An earlier capture's apparent narrower local text is not evidence
  of a current width regression. The same earlier live screenshot had a blank
  hero region, so large pixel scores must be interpreted with capture evidence.
- All 192 unit tests pass. Registry audit remains 74/76 with only explicitly
  deferred auth components missing; dispatch coverage is not full prop proof.
  Stopped only the temporary 4362/4363/4364 servers after the runs.

### Nested dialog lifecycle parity

- Native dialogs append their active content to document.body. A nested dialog
  therefore survives removal of its parent trigger unless explicitly closed;
  the legacy React subtree unmounted it automatically. Dialog triggers now
  register with the common content-unmount lifecycle, closing detached child
  dialogs when a parent dialog or containing CMS block is removed.
- Browser regression opens a dialog inside another dialog, closes the parent,
  verifies both portals disappear, then reopens both and confirms a single
  fresh child. The full six-width browser fixture passes, including existing
  modal focus restoration, escape/outside-close and navigation behavior.
- Astro fixture build passes and check reports zero diagnostics across 161
  files. The preceding complete three-site visual baseline remains valid
  evidence for appearance; no screenshot rerun is claimed for this lifecycle fix.

### Native form reset validation

- Required checkbox groups use custom validity because HTML `required` on each
  checkbox would incorrectly require every option. Recompute that validity
  after native form reset restores checkbox states; previously a once-valid
  group could remain valid despite having no selection after reset.
- Browser regression checks a choice, resets, restores other required fields,
  and verifies submission is still blocked until choices are selected again.
  The final mocked submission retains the existing payload and endpoint.
- Full six-width browser fixture and Astro build pass; check reports zero
  diagnostics across 161 files. No real form submission was sent.

### Rich-text breakpoint alignment precedence

- Rich-text `align` was emitted as inline text-align, incorrectly outranking
  custom desktop/tablet/mobile CSS. The legacy Typography align rule is weaker
  than advanced CMS styles. Native rich text now supplies its alignment via a
  CSS custom property used in the component layer, matching the approach for
  headlines and preserving the intended CMS style precedence.
- A fixture sets align=right with mobile left/tablet center overrides. Computed
  alignment matches at 375, 599, 600, 899, 900 and 1280 px. Explicit custom
  foreground/font inline behavior is unchanged.
- Full browser fixture and static build pass; Astro check reports zero
  diagnostics across 161 files. The last full site comparison predates this
  targeted custom-style correction.

### Media-provider failure fallback

- Video sections already listen for `lumen:media-error` to reveal their CMS
  fallback image. Native players dispatched it for media-element failures but
  not for failed dynamic provider imports/initialization. Both paths now use
  the same error notification, and errors arriving after content disposal are
  ignored instead of mutating or notifying detached content.
- Tests reject an HLS provider import and verify a bubbling error reaches its
  containing section. A second test unmounts during loading and verifies that
  the later rejection produces neither events nor console errors.
- All 194 unit tests pass. Astro check reports zero diagnostics across 161
  files; static fixture build passes with the runtime dependency guard enabled.

### Calendar locale and view audit

- Checked the generated calendar schema and legacy event helpers against the
  native adapter: language, initial/allowed views and scroll-hour options are
  forwarded, while occurrence ordering, expiry and event/category color
  precedence already have direct legacy comparison tests.
- Extended actual Chromium coverage for every schema locale: de/fr/it/es use
  Monday-first calendars and en uses Sunday-first. Each rendered calendar
  label contains its locale's month name. Single-view configurations hide the
  redundant view selector. Every temporary calendar is disposed through the
  native lifecycle after the check.
- Full six-width fixture suite passes, including all four views, keyboard
  event activation, full-screen details and focus restoration. No production
  implementation change was needed for these verified locale/view props.

### Non-fatal SVG image failures

- Inline SVG image fetch errors previously propagated out of the Astro image
  component, potentially failing an entire page build or server render. The
  legacy client image reported SVG loading errors without failing the page.
  Native images now handle those failures locally, retain the configured
  dimensions/accessibility label, and log a warning without the source URL.
- Failed/empty SVG responses stay in the SVG branch rather than being treated
  as raster images. No unsanitized fetched SVG markup is rendered.
- A deterministic unavailable SVG fixture verifies a 40x40 empty image slot
  and visible following content at all six widths. The full browser suite and
  fixture build pass; Astro check reports zero diagnostics across 161 files.

### Consumer page locale configuration in rendered links

- Found that native search/dynamic-list links used page locale props, while
  server-rendered links read only process locale defaults. A consumer supplying
  a different defaultLocale/locales to Document could therefore render home
  links to the wrong public path. The shared Astro link adapter now accepts
  page locale settings, falling back to environment defaults when absent.
- Passed those settings through buttons, cards, card-list items, navigation,
  drawers, timeline links, image lists, news lists, rich text and simple story
  list results. This adds no client runtime or CMS credentials to links.
- Unit checks verify German-default home mapping, additional locales, anchors
  and queries, environment fallback and unchanged external links. Browser
  checks render German-default buttons/cards/rich text under the ordinary
  English-default fixture environment and verify `/`, `/en` and `/#content`.
- All 196 unit tests pass. Full six-width browser fixture and build pass;
  Astro check reports zero diagnostics across 161 files. Fixture link metadata
  was completed to conform to the generated Storyblok multilink types.

### Search controls after CMS subtree replacement

- Moved Ctrl/Cmd+K ownership from the first initialized search widget to one
  shared handler retained while any search widget remains mounted. Removing
  the first (including hidden responsive) widget no longer disables the
  shortcut for already-initialized siblings. The handler is removed when the
  final widget unmounts and reattached when a new one initializes.
- List-search input and clear listeners now have a disposal signal, and pending
  debounce timers are cancelled on content unmount. A query typed in a removed
  widget can no longer mutate the current page URL later.
- Browser regression removes the initial hidden search and successfully opens
  the remaining dialog with Ctrl+K. Unit regression checks both pending and
  subsequently dispatched input events on a detached list-search element.
  All 197 unit tests, full browser fixture, static build and Astro checks pass
  (161 files, zero diagnostics). No change to submission/search API contracts.

### Parallax cleanup during CMS and dialog replacement

- Parallax now owns its controller and lazy observer per section. Removing a
  section through the content-unmount lifecycle disconnects observation, removes
  image-load listeners and destroys that section's controller without stopping
  adjacent sections. Repeated content-mounted events no longer observe pending
  sections multiple times, and late intersection callbacks cannot reactivate
  removed content.
- Nested parallax sections register their own layers rather than also registering
  them with a parent's controller. Animation props, the 400px lazy margin and
  expanded-layer sizing remain unchanged.
- Validation: 200 tests across 49 files pass, including active removal, delayed
  observation disposal and nested-layer ownership. Astro check reports zero
  diagnostics across 162 files; the static fixture build and six-width Chromium
  suite pass. The first sandboxed build lacked remote SVG assets; rebuilding with
  network access resolved that unrelated fixture failure.
- This is a component lifecycle fix, not a new three-site visual baseline. The
  full prop/consumer acceptance audit and final 30-page comparisons remain open.

### Empty CMS grid blocks preserve wrapper geometry

- The refreshed Bali mobile comparison exposed the homepage heading at x=16 with
  width=343 locally, versus x=32 with width=311 in production. Its CMS column
  contains an empty background/style block. Legacy `useBackgroundBox` treats the
  presence of either block as custom styles and retains `lm-grid-column__wrap`,
  whose global theme rule supplies 16px padding. Astro had tested only emitted
  CSS declarations, incorrectly removing this wrapper for empty blocks.
- Row/column wrapper selection now follows the presence of background or the
  first desktop/mobile/tablet/hover style block. This preserves the CMS author's
  layout even when the block currently contains no declarations. Plain columns
  without these blocks remain unwrapped, matching the legacy implementation.
- Added six-width browser checks for empty backgrounds and each style state,
  including a no-block control. All five configured cases retain row/column
  wrappers and 16px column padding. All 200 unit tests pass; Astro check reports
  zero diagnostics across 162 files; static build and browser fixture pass.
- Direct inspection of the running Bali development page after the fix confirms
  heading x=32, width=311 and wrapper padding=16px, identical to production at
  375px. The three-site run started at 02:25 UTC uses pre-fix static builds and
  must not be reported as acceptance of this fix.

### Three-site pre-wrapper-fix baseline (2026-11-03 02:25 UTC)

- All 180 page/viewport comparisons completed: every local/live response was
  HTTP 200 and every capture had zero horizontal overflow. Strict zero-pixel
  matching flags all cases; this threshold is diagnostic rather than the user's
  acceptance requirement.
- Desktop/mobile median changed-pixel percentages: Bali 9.81%/19.12%, Planet
  9.32%/25.56%, Upskill 11.71%/17.29%. Browser-error cases: Bali 4, Planet 0,
  Upskill 4. Planet's drawing-tool image warnings compare the same already-broken
  Storyblok asset with `/f/` versus `//f/` URL spelling; they do not establish a
  newly missing asset in Astro.
- Reports: Bali `2026-11-03T02-25-52-753Z-c7bb04`, Planet
  `2026-11-03T02-25-52-705Z-7308fe`, Upskill
  `2026-11-03T02-25-52-384Z-a38286` under `.website-tests/results/<site>/`.
- Standalone server rebuild and API/preview integration checks also passed.
  Registry audit still reports 74/76 dispatches, with only the two explicitly
  deferred authentication components absent.
- All three samples were subsequently rebuilt with the empty-grid-wrapper fix;
  a new full 180-comparison run is in progress. Keep these pre-fix figures distinct
  from the new run when assessing visual acceptance.

### Post-wrapper full baseline and inherited flex wrapping

- Completed another full 180-comparison run with the empty-wrapper fix. All
  captures return HTTP 200 and have zero horizontal overflow. Desktop/mobile
  median changed-pixel percentages are Bali 3.88%/10.93%, Planet 9.92%/26.81%,
  Upskill 9.81%/15.16%. Strict zero-pixel checks still fail all 180 comparisons.
  Browser-error cases: Bali 2, Planet 0, Upskill 4.
- Reports: Bali `2026-11-03T02-33-15-426Z-8daa8d`, Planet
  `2026-11-03T02-33-15-287Z-091829`, Upskill
  `2026-11-03T02-33-14-082Z-089889` under `.website-tests/results/<site>/`.
- Reviewing Upskill accommodation screenshots exposed another real discrepancy:
  icon/text feature rows wrapped vertically, adding hundreds of pixels down the
  page. CMS `flex_wrap: inherit` was stored as `--lm-wrap: inherit`, which inherits
  the custom property rather than the parent's actual flex-wrap. The variable
  fallback then selected `wrap`; the legacy property inherits `nowrap` here.
- The three CSS-wide values exposed by the FlexRow schema (`inherit`, `initial`,
  `revert`) now apply directly to flex-wrap through component-layer selectors.
  Custom authored CSS remains higher priority. Six-width regressions verify all
  three values with a parent using wrap-reverse, plus an unimportant custom
  flex-wrap override. Astro check, static build and browser fixture pass.
- The 02:33 reports predate the flex-wrap keyword fix; they are not its final
  acceptance baseline. Remaining review must distinguish these reports from any
  subsequent rebuilds and reruns.
- Rebuilt the actual Upskill sample after the keyword fix and inspected the
  accommodation feature rows: flex-wrap is now `nowrap`, with text at x=80 and
  width=263 beside the 24px icon and 24px gap (previously x=32, width=311 on a
  separate line). The temporary 4362–4364 servers were stopped after verification;
  the user's 4321 development server was left running.

### Final-wrap baseline and component appearance audit

- The 02:40 UTC run includes the flex-wrap keyword correction: 180 comparisons
  completed, all local/live responses HTTP 200, zero horizontal overflow.
  Desktop/mobile median changed-pixel percentages: Bali 3.88%/10.93%, Planet
  9.78%/20.55%, Upskill 9.63%/14.36%. Browser-error cases: Bali 2, Planet 0,
  Upskill 4. Strict zero-pixel matching still flags all cases.
- Reports: Bali `2026-11-03T02-40-03-003Z-cdd630`, Planet
  `2026-11-03T02-40-01-968Z-f8cbd8`, Upskill
  `2026-11-03T02-40-02-662Z-353e71` under `.website-tests/results/<site>/`.
- A direct legacy field-read comparison identified `autocomplete_variant` as a
  missing category-box option. It now uses the native form field classes for
  standard, filled and outlined appearance. Browser checks exposed DaisyUI's
  utilities overriding the earlier component-layer standard/filled styles; those
  two shared rules now reside in utilities, preserving their higher specificity.
  All three appearances and category text filtering pass at six widths.
- Heading metadata comparisons found matching font family, font size, line
  height and color for unambiguously matched visible headings. The geometry
  review identified an extra 16px margin before accordion expand icons, absent
  from the legacy MUI component. Removing it restores title space and prevents
  avoidable extra line wrapping. Six-width browser tests assert the title/icon
  spacing and retain the existing accordion interaction checks.
- Validation: 200 unit tests, zero Astro diagnostics across 162 files, fixture
  build and the six-width browser suite pass. All three 31-page site samples were
  rebuilt, and a fresh complete run was started at 02:46 UTC. The 02:40 report
  predates these appearance corrections and must not be called their final run.

### Latest full visual baseline: appearance corrections (02:46 UTC)

- All 180 comparisons completed against rebuilt samples containing the category
  appearance and accordion-width fixes. All responses are HTTP 200; no capture
  has horizontal overflow. Strict zero-pixel matching still flags all cases.
- Desktop/mobile median changed-pixel percentages: Bali 3.88%/8.33%, Planet
  9.78%/20.29%, Upskill 9.63%/13.45%. Browser-error cases: Bali 4, Planet 0,
  Upskill 4; all eight recorded messages are Google iframe sandbox access errors.
  The iframe renderer retains the same shared sandbox policy as legacy.
- Reports: Bali `2026-11-03T02-46-06-271Z-807aa1`, Planet
  `2026-11-03T02-46-06-457Z-575cf3`, Upskill
  `2026-11-03T02-46-05-817Z-6b024f` under `.website-tests/results/<site>/`.
- Planet's 1,522 unambiguously matched visible headings have identical font,
  family, line-height and color; none retain height differences over 10px after
  removing the extra accordion icon margin. This is heading evidence, not a
  blanket assertion of page equivalence.
- Actual requested Bali summer-school page heights local/live: 3640/3635 at
  375px, 2678/2686 at 1280px. Upskill accommodation mobile heights now match
  exactly at 14719px after the flex-wrap fix. Image rendering and asynchronously
  appearing content still contribute pixel differences.
- The latest standalone server build and API/SDK preview integration suite also
  pass. Registry remains 74/76 with only explicitly deferred auth dispatches
  absent. Unit/fixture/typing evidence remains 200 tests, six viewport widths,
  and 162 checked files with zero diagnostics.
- Concrete remaining lifecycle work: CardList currently observes pagination
  sentinels on initial rendering and `astro:page-load`, but not
  `lumen:content-mounted`. A list cloned into a dialog or inserted by CMS preview
  can therefore leave items beyond the first 30 hidden. Add mount/disposal
  coverage and correct this before declaring the full migration complete.

### Card-list pagination for dialogs and inserted fragments

- Moved card pagination into a native client initializer used on initial render,
  `astro:page-load`, and `lumen:content-mounted`. Each paginated list owns one
  observer; duplicate mount events do not create another observer. Removing its
  containing dialog/fragment disconnects observation and filter listeners, and
  ignores already-queued observer callbacks.
- Pagination reveals the next 30 eligible cards, keeps filtered cards hidden,
  resumes after a containing widget's filter update, and scopes queries so nested
  lists do not reveal each other's cards. Re-observing a still-visible sentinel
  allows short batches to continue filling the viewport.
- Four new unit regressions cover dynamic mounting/batches, filter reset,
  disposal/late callbacks and nested lists. Browser tests open a real CMS dialog
  containing 31 cards, scroll to reveal card 31, close and reopen it twice at
  375px and 1280px. All cases pass within the complete six-width fixture suite.
- Clarification from source inspection: full Storyblok document preview already
  dispatches `astro:page-load`. The missing initialization affected dialogs and
  inserted fragments; observer disposal also fixes cleanup during full preview
  replacement. Global CMS scripts and FastSpring initialization retain their
  existing full-document page-load behavior.
- Validation: 204 tests across 50 files pass; Astro check has zero diagnostics
  across 163 files; fixture and standalone builds pass; dynamic story-list and
  standalone API/SDK preview integration suites pass. Real-site navbar tests
  pass for all three sites, including keyboard opening/dismissal, viewport bounds
  and mobile drawers. The fresh 180-comparison run is in progress.

### Completion audit and final requested comparison run

The agreed implementation scope is complete on `feature/astro-daisyui`: native
Astro component rendering, shared server enrichment and native server adapters,
responsive CMS styling, existing submission contracts, official SDK preview
integration, and the requested three-site comparison run. Authentication remains
excluded as explicitly requested. The old renderer remains available as a
reference/test oracle; it is not part of the emitted Astro runtime. The Astro
package remains a private workspace package, not an independently published npm
release. No deployment or real external form submission was performed.

Final verification:

- 204 unit/contract tests in 50 files; Astro check: 163 files, no diagnostics.
- Static fixture, three 31-page samples (30 selected pages plus 404), and
  standalone server builds pass. Every build enforces the emitted-runtime guard
  against React, Next, MUI and Emotion. No React Hook Form references occur in
  the emitted client/server JavaScript of the final builds.
- Six-width browser fixture passes, including new dialog pagination reopening.
  Dynamic story-list browser checks and standalone API/SDK preview checks pass.
  Real-site keyboard menus and mobile drawers pass on all three sites.
- Registry review: 74/76 legacy dispatch names accounted for. The missing names
  are auth_container/auth_form, excluded by instruction; two Instagram names
  retain their already-disabled legacy behavior. Optional travel exports and
  adapters are implemented separately and covered by their contract tests.
- Final 30 pages per site at 1280px and 375px: 180 complete comparisons, all
  local/live responses HTTP 200 and no horizontal overflow. One original live
  navigation to Bali `/de/infos/unterkunft` at 375px timed out; a separate retry
  with identical settings completed successfully. Preserve the original failure
  and retry artifacts rather than overwriting the record.
- Median changed pixels (desktop/mobile): Bali 3.88%/8.33%, Planet 9.78%/20.29%,
  Upskill 9.63%/13.45%. All 180 cases still fail the runner's strict zero-pixel
  threshold. This is explicitly not a pixel-perfect-parity claim; the user
  accepted visual differences while requiring the same general structure.
- Across 4,860 unambiguously matched visible headings, font family, font size,
  line-height and color match production. This supplements the shared theme
  tests; it does not assert pixel identity for all page content.
- Browser errors occurred in five Bali captures and four Upskill captures, all
  Google iframe sandbox access messages; Planet recorded none. The renderer uses
  the same sandbox policy helper as the legacy implementation. Previously noted
  upstream missing images and asynchronous embed/animation differences remain
  visible in the reports. Hosted Storyblok editor iframe-handshake testing has
  not been performed; the installed SDK input path and local authenticated
  preview behavior have been exercised. These limits remain disclosed.

Final reports:

- [Bali](../.website-tests/results/bali/2026-11-03T02-55-01-478Z-688b4d/report.html)
  and its [single-page retry](../.website-tests/results/bali/2026-11-03-card-final-retry/report.html).
- [Planet](../.website-tests/results/planet/2026-11-03T02-55-00-063Z-73c531/report.html).
- [Upskill](../.website-tests/results/upskill/2026-11-03T02-55-01-501Z-f8530e/report.html).

Each final run directory also contains `verification-summary.json`. Bali's
summary uses the successful retry for that one case and links to its report.

### Optional FastSpring bootstrap exclusion

- Document now renders FastSpringProvider only when settings contain an
  ecommerce_fastspring_config with a URL. Previously the provider was rendered
  unconditionally: it skipped the external SDK without configuration, but Astro
  still included its otherwise-unused bootstrap script in pages such as Bali.
- All 31 rebuilt Bali HTML pages contain neither the provider configuration nor
  a FastSpring bootstrap script. A browser regression checks that an unconfigured
  document loads no FastSpring resources; the existing configured checkout
  fixture continues to pass. Astro check and the complete browser suite pass.
- This removes an unnecessary browser request; it does not claim that optional
  shared component assets are absent from every build output directory.

### DaisyUI/Astro cleanup

- Document renders ShopifyCart only for Shopify configuration, CustomScripts only
  for configured scripts, and StoryblokPreview only in preview mode. The existing
  FastSpring URL guard remains. Optional build assets may still exist on disk;
  published pages do not reference unused bootstraps.
- Grouped button, navigation, accordion, form, and tab styles into five component
  stylesheets, retaining CSS layers and CMS override priority. Removed redundant
  declarations without changing theme tokens, fonts, breakpoints or authored CSS.
- Compared 1,362 computed component-style snapshots across three fixture pages
  at six widths: zero differences. All 204 unit tests, the complete browser fixture
  suite, Astro check (164 files), and standalone API/Storyblok preview checks pass.
- Rebuilt all 31 Bali sample HTML pages: none reference FastSpring, ShopifyCart,
  or StoryblokPreview bootstrap scripts. Existing configured commerce and custom
  script fixture behavior continues to pass.

### Accessibility remediation and repeatable auditing

- Added a shared reduced-motion lifecycle handler. Entrance animations, parallax,
  counters, timelines/rewards, tabs, galleries and dialog transitions stop
  decorative movement when the OS preference requests it, including live changes.
  Slideshow autoplay stops and its pause/start button allows an explicit restart
  with the configured interval and zero transition speed.
- Entrance content is visible before JavaScript initializes, including when
  JavaScript is unavailable. Parallax background layers use empty decorative alt
  text instead of reading their URLs. Informative imagery should use image blocks
  with authored alternative text.
- Added keyboard-visible skip navigation to the main landmark; descriptive tab
  group names; field help associations; valid names for radio/checkbox groups;
  valid lightbox trigger semantics and focus outlines; larger carousel pagination
  spacing/hit areas; and destination-name fallbacks for otherwise unnamed links.
- Non-action button blocks in custom accordion summaries render as decoration,
  preserving their appearance without nesting interactive controls. Actual links
  and configured actions are not silently disabled. Empty generated headings are
  excluded from the accessibility tree without changing their layout.
- `pnpm test:astro:a11y-fixture` covers reduced motion, live preference changes,
  explicit autoplay controls, no-JavaScript motion content and native accordion
  keyboard operation. `pnpm test:astro:a11y` audits the built 30-page samples for
  Bali, Planet and Upskill at 1280px and 320px, including available accordion,
  search, tab, menu and native form-validation states. It checks skip-link focus
  and page overflow and exits nonzero for violations rather than suppressing them.
- Reports are written to `.website-tests/astro-accessibility/report.json` with
  node selectors, failure explanations, incomplete checks, runtime errors and
  viewport/state details. Counts include repeated occurrences across states.
- Automated auditing blocks external provider scripts/frames and never submits
  forms. It is not screen-reader verification or a WCAG conformance claim.
  VoiceOver/Safari, NVDA, third-party embeds, visible focus contrast and actual
  browser/text zoom still need manual validation.
- CMS-authored colors, heading structure and raw HTML remain editorial follow-up:
  examples include low-contrast theme/navigation text, empty rich-text links,
  unnamed embedded frames, and Planet pricing HTML with nested main landmarks,
  unlabeled checkmark semantics and an unfocusable horizontal comparison table.
  These require authored content/theme corrections; the renderer does not rewrite
  arbitrary HTML or silently change brand palettes to hide audit failures.

- Final validation: 205 unit tests in 51 files; Astro check across 167 files with
  zero diagnostics; existing browser fixtures; reduced-motion/no-JS fixtures;
  standalone API and Storyblok preview checks all pass. The full audit completed
  180 page/viewport combinations and 398 states, with zero navigation failures
  and zero page-level horizontal overflow. A targeted two-viewport Upskill blog
  rerun verified the loading-status fix and was merged into the full report.
- Automated results are intentionally still failing on remaining content/theme
  findings. `summary.json` additionally deduplicates findings across interactive
  states by site, route, viewport, rule and target. Native screen-reader and
  third-party integration verification remains outstanding.

### Remaining accessibility ownership and rich-text fixes

- Reviewed the remaining audit markup against RichTextNode, shared dynamic
  rich-text rendering, Paragraph, Headline, Html, Iframe and component CSS.
- Fixed renderer-owned color-only text links with persistent underlines, preserving
  all foreground/background colors. This applies to rich text and Markdown.
- Added a shared conservative content-presence check: whitespace-only rich-text
  links retain formatting but do not create unnamed anchors; empty rich-text
  headings retain layout while being excluded from the accessibility tree.
  Image links and named links remain intact. Initial Astro and dynamic list
  rendering use the same check.
- Validation: 208 unit tests; Astro check (168 files, zero diagnostics); complete
  component fixture suite including color assertions; reduced-motion/keyboard
  checks including underlined links; and dynamic story-list integration checks
  pass. Rebuilt all three samples and reran 180 page/viewport combinations and
  398 states: no navigation failures or page overflow, and no remaining
  empty-heading, link-name or link-in-text-block violations.
- Remaining ownership: heading hierarchy/main-title tags require Storyblok
  editorial decisions; unnamed embedded frames and pricing HTML semantics require
  edits to authored HTML in Storyblok. Pricing fixes retain classes/colors:
  nested main → div; check/dash spans → role=img with existing names; table wrapper
  → tabindex=0, named region and visible focus. No published CMS data was edited.
- Contrast is explicitly shared between CMS foreground/background/theme values
  and renderer variants/opacity. It is not claimed to be purely a CMS defect or
  fixed without a design decision. This pass changes no site colors.
- `pnpm astro:a11y-report` generates ownership.html and ownership.json with
  page links, target selectors, markup, owner and suggested changes. Full audits
  now generate them automatically and retain their nonzero exit for violations.
  Summary counts group viewports and states by site/route/rule/target; they must
  not be compared directly to earlier per-viewport counts. Reports live under
  `.website-tests/astro-accessibility/`. Manual screen-reader, third-party embed
  and contrast/design review remains required before any conformance claim.

### Astro image pipeline audit (2026-11-03)

- Audited all 16 migrated image renderers against their legacy components and
  Astro's image/service documentation; see `docs/astro-image-audit.json`.
- Replaced the globally configured Storyblok-only external service with Astro
  Sharp and a shared `CmsImage` wrapper. Ordinary Storyblok images retain CDN
  width transforms; authorized remote and public raster sources support real
  optimization in both static and Node SSR builds. JPEG/PNG inputs offer an
  AVIF source with WebP fallback. Explicit format/fit/position transforms use
  Astro's service rather than silently discarding those options.
- Removed guessed intrinsic dimensions from proportional renderers; fill
  renderers now reserve their geometry through their existing containers.
  Added fixed-size hints, density support, preloads, parallax blur cleanup and
  preserved drawer versus toolbar logo loading/quality differences.
- Client-only list templates no longer advertise fake responsive variants for
  non-Storyblok images or SVGs. New non-Storyblok sources discovered after a
  static build need the existing server-rendered story endpoint for optimization;
  arbitrary runtime transformations are not available on a static-only host.
- Validation: Astro check clean; 241 unit tests across 55 Astro test files;
  existing browser fixture passes all six viewport widths. The new
  `pnpm test:astro:images` exercises actual static output and a running Node SSR
  optimizer, image bytes/dimensions/formats, density sets, responsive selection,
  CSS fill, public assets, preload and placeholder lifecycle.

### Published pagination image endpoint (2026-11-03)

- Published `Document` contexts now default to `/api/story-list`. Added the
  production route to the companion server and a dev-only route to the static
  source tree. Shared context creation keeps initial and paginated themes equal.
- The endpoint reloads published page configuration, resolves the requested list
  server-side and rejects missing/private contexts and invalid requests. Explicit
  published CMS reads now stay public even with development/preview query state.
- The local static server proxies `/api/story-list` and `/_image` using
  `LUMEN_SERVER_ORIGIN`. Production deployments need the equivalent two routes;
  no cross-origin renderer or image rewrite is required in the browser.
- `pnpm test:astro:story-images` passed with a real static build and real production
  API/optimizer server. Only the external CMS/image upstream is replaced: page 2
  introduces a previously unseen raster, and Chromium receives a resized AVIF
  through the same public origin. Search, history, source/list/page rejection and
  absence of browser CMS calls are also checked. Astro check is clean.
