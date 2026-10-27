# Visual sign-off plan for the three reference websites

Date: 27 October 2026. Branch: `feature/mui-v9`.

Goal: preserve the live appearance and interactions of planet.training,
upskill.study and baliinternships.com when consuming the upgraded core package.
The representative pass and the remaining-route sweep have been executed.
All 2,898 remaining desktop/mobile cases ran across the three sites and all nine
site/locale combinations. Navigation and targeted fix retests are also complete;
see [migration verification](migration-verification.md#actual-consumer-verification--27-october)
and [the audit summary](visual-route-audit-summary.json). The complete browser,
state and extra-viewport matrix below remains a release goal: the full route
sweep covers Chromium at 1280px and 375px.

## Environment validation — completed

Read-only Storyblok CDN requests on 27 October confirmed both tokens for each
site identify the same expected space. Published and draft requests for the
actual CMS slug `home` returned HTTP 200. Token values are omitted from this
document and [the validation results](reference-environment-validation.json).

| Website | Consumer environment source, relative to this repo | Space | Public / preview validation | Next locales |
| --- | --- | --- | --- | --- |
| baliinternships.com | `../websites/packages/baliinternships/.env` | Baliinternships · 66717 | Both pass | en, de, id |
| planet.training | `../websites/packages/planet-training/.env` | Planet Training · 73553 | Both pass | en, de, it, es |
| upskill.study | `../websites/packages/upskill/.env` | Upskill · 67295 | Both pass | en, de |

- The core `.env` currently contains only `NEXT_PUBLIC_PREVIEW_TOKEN` and
  `NEXT_PUBLIC_PUBLIC_TOKEN`, matching **Bali Internships**.
- All three pairs in `.env.reference.local` match their respective consumer
  `.env` files. The core `.env` and `.env.reference.local` are Git-ignored.
- No `.env.local`, `.env.production` or `.env.production.local` was present in
  the inspected core/consumer directories, and no shell override of the
  configured keys was detected during validation. Recheck before execution.
- Planet additionally sets `NEXT_PUBLIC_SUPPRESS_SLUG_LOCALE=true`,
  `NEXT_FALLBACK_MODE=blocking`, `SITEMAP_HOSTNAME=planet.training`, and
  `NEXT_PUBLIC_OVERWRITE_SETTINGS_PATHS=support,hilfe`.
- The core reference runner switches tokens and build directories, but does
  **not** import Planet's additional settings or each site's Next locale and
  redirect configuration. Use isolated copies of the **actual consumers** for
  final sign-off. The two tokens alone do not describe all three environments.
- Compare production builds with **published** content. `yarn dev` selects draft
  content in the current Storyblok service and is a separate development check.
  Keep `NEXT_PUBLIC_PREVIEW_MODE`, `TEST` and `ANALYZE` unset for full release
  comparisons. Public Next environment variables require a rebuild after changes.

## 1. Freeze one candidate and the comparison inputs

1. Finish the existing button-spacing correction, analytics declarations and
   portable Swiper types; run unit tests, lint and TypeScript 7. Run the new
   `BlockWithoutIcon` Storybook play case and the existing Google Form fixture.
2. Build Storybook and package one candidate tarball. Record its SHA-256 and
   Git revision, including whether any changes remain uncommitted. Install the
   exact same tarball into all three isolated consumers, with one React version.
3. Preserve each consumer's `.env`, locale list, redirects and settings paths.
   Keep the production check's type checking enabled. Build all three without
   `--smoke`. All three full builds passed with the final v6 archive. Clear the
   isolated `.next/cache` when replacing same-version candidate archives; cached
   immutable-package snapshots otherwise can retain old compiled code.
4. Record the build timestamp, CMS cache version, browser version, viewport and
   device pixel ratio. Capture live/local pairs close together. If content
   changes between them, recapture with equivalent published content before
   deciding whether the difference is a code regression.
5. Keep the original website checkout and port 3000 untouched. Suggested
   isolated consumer servers: Bali 3020, Planet 3021, Upskill 3022. The previous
   isolated workspace is `/tmp/lumen-consumer-mui9`; check its contents before
   reuse. The preparation script can create a fresh copy in a new directory.

## 2. Inventory routes and visible component types

Create a per-site route manifest from the live main navigation, nested menus,
footer links and sitemap, reconciled with published CMS pages and build output.
Record locale, page template, visible CMS components and relevant interactions.
Follow navigation links to reach the core journeys; also test direct URL loads,
refresh, back/forward and query-string states. Do not invent translated slugs
or treat successful client navigation as proof that server rendering works.

The inventory must distinguish checked, pending, excluded and blocked routes.
Document redirects, intentionally unpublished pages and external destinations.
An external booking or checkout destination is checked for its link target;
no purchase or booking is part of visual sign-off.

## 3. Core journey matrix

These routes are known from the prior audit; confirm them against current menus.
Add representative destinations from every remaining main-navigation branch.

| Site | Required journey / page | States to compare |
| --- | --- | --- |
| Bali | `/` | Hero; dismiss consultation popup; every internship/volunteer/study card section; logo carousel; testimonials; footer; “show all” links and section heights |
| Bali | `/traineeship-bali-indonesia`, `/fees` | Listing cards, search/filter controls where present; fee content and calls to action |
| Bali | `/volunteer-nature-and-wildlife-conservation` → `/turtle-conservation-volunteer-bali-indonesia` | Category → detail; Program Details and Program Benefits tabs; below-fold content |
| Bali | `/info/faq` | Collapsed, expanded and keyboard-operated accordions; mobile wrapping |
| Bali | `/tropical-coastal-ecology-and-community-based-management-postgrad-study-bali` | Study hero, text/image sections, video embed and footer |
| Bali | `/blog-articles` → article detail | Desktop sidebar below navigation; Internship filter/query; mobile filter drawer; article typography and images |
| Bali | `/contact`, plus the configured form destination | Field labels, widths, required validation, selects/date fields if present, error/loading/success appearance where safely reproducible |
| Planet | `/` → Solutions → `/app-sports-coaches` | Header, hero background after loading, cards, logos, FAQ, footer; remaining Solutions and Sports templates discovered from navigation |
| Planet | `/pricing` | Monthly/yearly; one/two teams; card colors, totals, feature comparison, active controls and mobile layout |
| Planet | Support / Hilfe and blog destinations | Settings-path overrides, localized navigation, lists, search and article layouts where present |
| Upskill | `/` → `/sustainable-tourism-summer-course-bali` | Hero/announcements, facts, custom Course Objectives accordion, field trips and footer; fresh desktop/mobile load must not duplicate sections |
| Upskill | `/accommodation-study-abroad-bali` | Cards; Private Villa anchor and back-to-top; images and text spacing |
| Upskill | `/application` | Embedded form sizing, loading, scrolling and validation; mobile overflow |
| Upskill | Remaining Information / Application / Questions branches | Dates, fees, FAQ/contact and other unique templates found in the route inventory |

## 4. Viewports, locales and browser coverage

| Coverage | Required scope |
| --- | --- |
| Mobile 375 × 812 and desktop 1280 × 720 | Every core journey, each interaction state, and full-page captures of every inventoried published route |
| Small mobile 320 × 740, tablet 768 × 1024, wide desktop 1440 × 900 | Every unique layout/template and responsive navigation, forms, cards, tables and grids |
| Breakpoint edges | One pixel below/above each site's configured navigation/grid breakpoint; check menu switching and visibility classes |
| Locales | All configured locales above: navigation/footer, homepage and each translated template; prioritize long labels and paragraphs. Include every published locale URL in the route manifest |
| Available Chromium-based browser | Full comparison matrix and interaction checks; record the actual browser/version |
| Safari and Firefox | Core journeys and risky controls on desktop/mobile-sized viewports, including fresh-load hydration, fonts, sticky elements and date/select controls |

Safari previously failed because native Computer Use permissions were not
granted. Firefox was not available through the connected browser tools. Keep
both marked **blocked/unverified** until an authorized browser or CI runner is
available; do not count Chromium's mobile viewport as an iOS Safari test.

## 5. Capture and compare consistently

- Capture full pages **and** viewport images at the hero, each major section and
  footer. Scroll to load lazy images, then verify fonts/images have settled.
  Keep scroll positions, popup dismissal and form state equivalent.
- For each template, inspect typography, line wrapping, palette colors, margins,
  gutters, container width, image crop, borders/shadows and button/icon geometry.
- Compare header/footer, sticky navigation, open menus, drawers, dialogs,
  accordions, tabs, active/hover/focus/disabled states and validation errors.
  Check click/tap targets and keyboard focus without submitting production data.
- Measure document height, key heading/card positions and horizontal overflow.
  Matching hero screenshots are insufficient: previous regressions appeared
  farther down the document or only after a fresh load.
- Inspect console errors on fresh loads and navigation, especially hydration
  errors, missing chunks, failed images and duplicated content. Keep pre-existing
  live-site warnings distinguishable from new candidate errors.
- Use decoded screenshot differences to locate changes. An unexplained layout,
  font, color, wrapping or interaction difference fails regardless of its small
  percentage. Pixel equality is useful evidence, not the only acceptance test.
- Predeclare dynamic regions such as rotating announcements, external chat and
  video thumbnails. First compare their container geometry and behavior; only
  exclude their changing content from pixel checks. Do not mask new differences
  merely to make a result pass, or auto-accept updated baselines.

## 6. Highest-priority regression checks

1. **Bali homepage card sections:** the latest empty-icon pseudo-element fix
   must restore block button height without changing inline button width.
   Recompare all three stacked card groups and the footer position.
2. **Bali blog:** Blog and Schedule Call remain visible/clickable with a desktop
   sidebar; the mobile filter drawer still overlays correctly and closes.
3. **Upskill course:** fresh mobile and desktop loads have one copy of each
   section, no hydration errors and working click/Enter accordion expansion.
4. **Planet pricing:** palette-path colors, heading geometry and price changes
   match the live yearly/monthly and team-count states.
5. **Shared components:** preserved grid gutters, nested layouts, responsive
   headings, forms, icon buttons, carousels and Storybook controls. Recheck
   existing before/after fixtures after the latest button change.

## 7. Form behavior — separate from visual confirmation

The user identified the test form as part of the Bali Internships endpoint.
Trace the actual published form block, action and destination in that site's
configuration before selecting a submission test. The core `/api/form-endpoint`
currently echoes received data; that alone does not prove Google saved a response.

Visual checks can cover rendering and required-field validation immediately.
Successful Google submission needs a confirmed test destination, clearly marked
synthetic data and observable receipt in the form's response store. The existing
`no-cors` request cannot confirm acceptance by its response alone. Do not mark
this passed based only on an on-screen success message or an echo response.

## 8. Completion criteria and deliverables

- A route/state/viewport/locale/browser matrix with evidence for each result;
  no required item silently omitted or left marked as passed without a capture.
- Live/local screenshots and difference images linked from a local report, plus
  an issue log explaining every intentional or dynamic difference.
- All identified regressions fixed and affected pages/interactions rechecked.
  Shared component changes also trigger a representative check on all three sites.
- The same final tarball passes all three full consumer builds, TypeScript 7,
  unit tests, lint, Storybook build and relevant Storybook play cases.
- No unresolved visual regressions in the agreed matrix. Any unavailable browser,
  inaccessible route or unverified form submission remains explicit; the report
  must not claim universal “zero regressions” while such coverage is incomplete.
- Save the final verification notes and follow-up code as a local checkpoint.
  Deployment, npm publication and accepting a new remote visual baseline remain
  separate actions. This plan uses direct live comparisons as requested.

Execution order: candidate/environment freeze → the five priority regressions →
complete core journeys → remaining route/template and locale coverage → extra
viewports/browsers → review differences and repeat affected checks → final report.

## Repeating the local route audit

The user authorized the local Playwright runner on 27 October. It uses an
isolated Playwright installation, without adding browser dependencies to the
published core package. The executed browser is recorded in each `run.json`.

1. Build the actual consumers using one package archive and their own environments.
2. Generate the public-route inventory with
   `node scripts/visual-site-inventory.cjs <consumer-workspace> <inventory.json>`.
   An optional third argument imports prior full-page observations. Public paths
   come from `pageProps.locale` and `pageProps.slug`; prerender aliases can contain
   duplicate locale prefixes and must not be mistaken for public URLs.
3. Reconcile the inventory with public sitemaps and actual navigation links.
4. Run the command below first without `--run` to inspect its queue. The tooling
   directory must contain Playwright and its matching Chromium installation.
5. Retest flagged captures with `--settle-ms 300`, in a separate output folder.
   Review raw differences, geometry, hydration errors, and dynamic-region bounds.
   A matching document height or small difference percentage alone is not a pass.
6. Generate the local viewer with
   `node scripts/visual-audit-report.cjs <audit-directory>` and serve that directory
   locally. The report reads `reviews.json` with source/timestamp-bound findings;
   stale review notes do not apply to newer captures.

```sh
node scripts/visual-site-audit.cjs \
  --inventory <inventory.json> \
  --output <audit-directory>/automated \
  --tooling /tmp/lumen-visual-runner \
  --candidate <archive-identifier> \
  --workers 3 --run
```

The runner saves desktop (1280px) and mobile (375px) raw PNG pairs and capture
metadata, resumes completed cases, and never submits forms, uploads screenshots,
or accepts baselines. Each candidate needs a separate output directory. Its
allowlist contains the three reference origins and isolated ports 3020–3022,
3030–3032, 3040–3042 and 3050–3052. Original consumer checkouts and port 3000 are not used by
the runner. The full sweep and targeted fix retests retain their own candidate
labels; the report selects the latest usable result per route and width.
