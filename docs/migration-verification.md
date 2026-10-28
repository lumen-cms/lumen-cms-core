# React 19 / MUI 9 migration verification

Branch: `feature/mui-v9`. Updated: 27 October 2026. Status: local migration candidate; **not approved for release**. Prepared as a local migration checkpoint; not deployed.

## Storyblok fetching update — 27 October

Fetching now uses `@storyblok/api-client` 0.9.1. All three final production builds
pass. The [server-data regression gate](storyblok-fetching-migration.md) compares
all 1,496 page-data routes against the preceding build: complete props and counts
match, with only the validated widget timestamp and Google Forms hidden token
normalized. TypeScript 7, 54 unit tests, Storybook, immutable install, and lint
pass. Screenshots stay paused; visual/editor and residual security follow-ups
remain open. See [fetching evidence](storyblok-api-verification.json).

## Storyblok runtime update — 27 October

The subsequent [Storyblok audit and migration](storyblok-upgrade.md) moves the
runtime to the stable official React/preview/rich-text packages. All three
production builds and 8,529 rich-text HTML comparisons pass. All 141 component
types now use the official CLI, with reproducible generation and TypeScript 7
checks. All 34 unit tests pass; 1,505 static pages have unchanged parsed body
markup against the preceding runtime builds (scripts excluded). Screenshots
remain on hold and live editor validation is pending. Consumer dependency
overrides are required as documented. See [type migration evidence](storyblok-types-verification.json).

## Subsequent security/tooling batch — 2026-10-27

The security and ESLint update after the Swiper audit is recorded in
[security-tooling-update.md](security-tooling-update.md). Its nonvisual checks
pass, with residual security and lint findings documented there. The user asked
to defer screenshot comparisons until more dependencies are upgraded; the
earlier visual sign-off below must not be treated as acceptance of this batch.

## Swiper 14 follow-up — 27 October

Swiper is upgraded from 8.4.7 to **14.3.0**. Modules now import from
`swiper/modules`; the bundled v8 React declarations and ambient CSS/type bridges
are removed. The installed v14 exports resolve with TypeScript 7 in the core and
packed consumers. `dom7` and `ssr-window` leave the dependency graph.

Compatibility corrections preserve the old arrow width, position and glyphs,
the 10px pagination offset, and visible card-effect edges. Only the MIT-licensed
navigation font remains as a small scoped asset; the runtime and types are v14.
Autoplay now resumes after hover when `pause_on_hover` is enabled. In v8 the
existing default options permanently stopped it; the v14 behavior matches the
setting's pause semantics. Touch swiping, keyboard navigation, arrows, clickable
pagination and autoplay/hover behavior were exercised in the browser.

Verification against the three sites' original environments:

- **45 affected routes / 90 desktop-mobile pairs:** 86 pixel-identical, four
  reviewed differences wholly inside external embeds/placeholders or non-Swiper
  carousels. Swiper regions were explicitly excluded from dynamic masking.
  All final page heights match; no horizontal overflow or runtime errors remain
  in this affected-route matrix. Every configured locale is represented.
- **26 later-slide comparisons:** all pixel-identical, including active index
  and container geometry, across locale homepages and distinct carousel setups.
  Locked sliders with every item visible correctly stay at the first index.
- **48 v8/v14 fixture comparisons:** 34 pixel-identical. The remaining 14 have
  reviewed 3D shadow/edge raster differences with identical slide/control
  geometry. Cube's upstream shadow plane changes from 90° to 89.99° (at most
  1/255 channel difference); card shadow differences are at most 2/255. Coverflow
  and creative effects differ only along transformed edges with equal computed
  transforms. All six effect modes and 599/600, 899/900px edges are represented.
- All three full production consumer builds, strict TypeScript, lint, 21 Vitest
  tests in 11 files and the static Storybook build pass. The navigation fixture's
  play assertions pass at mobile and desktop widths.

The final archive is `/tmp/lumen-candidate-swiper14-final.tgz`, SHA-256
`a5d8f95039a7dd5c539ed07cee6267713f5d8c66be8e8f49c1c0ee488c3ea849`.
All 476 packed source/client/config files match the working tree. Every isolated
consumer `.env` is byte-identical to its original; the source websites checkout
was not edited. [Machine-readable summary](swiper-upgrade-audit-summary.json).

The session's `mui9/swiper14/report.html`, `fixtures.html` and `states.html`
contain the raw comparisons and review notes. Scripts and metadata are retained
beside them. The `--freeze-swipers` audit option stops autoplay and selects index
0 before capture; interactions are verified separately rather than inferred from
frozen screenshots. The previous broad route audit below remains valid for
unchanged components; all published routes using Swiper were rechecked here.

Swiper 14's browser floor is Chrome/Edge 110+, Firefox 110+ and Safari/iOS 16.4+.
This pass uses Chromium; Firefox and Safari remain unverified. See the official
[v14 release notes](https://swiperjs.com/blog/swiper-v14),
[v9 migration guide](https://swiperjs.com/migration-guide-v9),
[v10 import changes](https://swiperjs.com/migration-guide-v10), and
[v12 navigation changes](https://swiperjs.com/blog/swiper-v12).
Nothing was deployed, published or accepted as a remote visual baseline.

## Actual consumer verification — 27 October

The remaining-route sweep is complete for Chromium at 1280px and 375px. The
inventory contains 1,481 canonical published routes: 594 Bali, 686 Planet and
201 Upskill. It was reconciled with all three live sitemaps and links found in
page captures and opened navigation menus. All **2,898 remaining width cases**
ran; 64 width cases already covered by the prior pass were excluded initially.
Additional linked routes and targeted retests extend that scope. Exact final
counts are in [the audit summary](visual-route-audit-summary.json).

All configured locales are represented: Bali `en/de/id`, Planet `en/de/es/it`,
and Upskill `en/de`. The full-page report retains raw live/local images, geometry,
HTTP status, runtime errors, candidate identifiers and timestamp-bound reviews.
Navigation checks cover 54 desktop-menu and mobile-drawer states, including
all nine site/locale combinations, keyboard focus and hover: 47 pixel-identical
and seven reviewed differences confined to external chat or SVG edge rendering.

The pre-Swiper package was `/tmp/lumen-candidate-v9.tgz`, SHA-256:

`915dadab2f4d9476f42061b1c82ee6082c884d1f5c3a4a334ddf08d927d4bd62`

All 477 packed source/client/config files match the working tree. All three
**full production builds** pass against that archive in
`/tmp/lumen-consumer-mui9-v9`. Each consumer's `.env` remains byte-for-byte
identical to its original. Planet's locale suppression, fallback and support
settings paths remain intact. The original `../websites` checkout and port 3000
were not changed. Token validation is recorded without values in
[reference-environment-validation.json](reference-environment-validation.json).

### Corrections found in the expanded sweep

- **Plain accordion alignment:** native button centering and MUI's content-slot
  `text-align: start` could both override CMS alignment. Both containers now
  inherit it. All 96 accordion-containing routes were rechecked after this
  change, including translated FAQ pages. Storybook exercises wrapped plain
  labels aligned start, center and right, alongside the custom-title fixture.
- **Selected drawer links:** the removed `ListItem button` API silently lost
  selected, hover and keyboard-focus styling. `ListItemButton` restores that
  behavior and the existing 48px row height. All locale drawers were rechecked;
  the new play fixture verifies selected styling, height and keyboard focus.
- **Production form hydration:** nested lazy-loaded text fields briefly rendered
  null during hydration despite existing server HTML. Standard fields now load
  with the already lazy-loaded Google Form. English/German association and club
  request pages are pixel-identical at both widths with no hydration errors.
  All affected form routes and representative pages on the other sites were
  rechecked after the final change. No production form was submitted.
- **Planet consumer redirect:** Next 16 throws for the legacy relative target
  `dealing -failure`. The [consumer patch](consumer-patches/README.md) encodes
  the absolute path, removing the local 500 and matching live at both widths.
  It is applied to the isolated consumer only and must accompany the actual
  consumer upgrade. The destination already returns 404 on production; this
  patch does not invent a replacement article.

The full sweep used candidate v6; every affected accordion route was retested
with v7, drawer states with v8, and all affected form routes with v9. Shared-page
checks accompany those fixes. This is a combined audit with targeted retests,
not a claim that every capture was repeated against v9. Candidate archives that
share a version require clearing `.next/cache`; the preparation script does so.

### Evidence and remaining distinctions

Artifacts are under the session's `mui9/route-expansion/` directory. Open
`report.html` for full-page pairs and `navigation.html` for interaction states.
`candidate-v9.json`, `storybook-v9.json`, `reviews.json` and per-case JSON retain
build identity, fixture results and the reasons for each reviewed difference.
The runner used Playwright 1.64.1 and Chromium 156.0.8078.4, DPR 1, reduced motion,
locale en-US and timezone Asia/Makassar. Desktop captures use 1280 × 720 and mobile
375 × 812 before full-page expansion. Published CMS content remains live.

Reviewed differences include external video/chat, carousel timing and failed
Storyblok assets already present on both versions. For dynamic regions, the
review requires every pixel outside measured visible bounds to match. Broken
images can expose alt text at different times depending on whether failure occurs
before hydration; the same behavior was reproduced on live. Raw pixels are kept,
not hidden by accepting a new baseline. Existing linked 404s are listed separately
in `existing-link-errors.json`. Invalid video IDs occur on both live and local;
Planet `/de/blog` also has a pre-existing hydration warning on both versions.
Pixel equality alone does not imply an error-free page.

TypeScript 7, ESLint, 21 Vitest tests in 11 files, the static Storybook build and
five targeted Storybook play fixtures pass. Earlier representative checks also
covered extra widths, navigation breakpoints, tabs, pricing and expanded
accordions; those remain in `signoff/` and `direct-review/`. The complete route
sweep covers Chromium at two widths, not every possible state and viewport.
Safari/Firefox and confirmed receipt of a test Google Form submission remain
unverified. No deployment, package publication, artifact upload or remote baseline
acceptance was performed.

## Checks

| Check | Result / scope |
| --- | --- |
| TypeScript 7 | Strict check passes; no disabled strictness checks |
| ESLint | Passes |
| Vitest | 21 tests in 11 files pass, including browser HTML parsing of custom accordion titles |
| Storybook 10 | Static build succeeds; existing controls render and reset |
| Offline Google Forms | Required validation, dropdown choice, multi-select choice, calendar selection checked in the browser; automated validation/dropdown `play` story completes |
| Production builds | All three actual consumers pass full production builds with the final Swiper 14 archive and TypeScript checking |
| Next development | Isolated `yarn dev` on port 3012 renders Bali after fixing Fast Refresh/CommonJS parsing |
| Chromatic | Not run; no artifact uploaded or baseline accepted. The user chose direct live-site visual testing for this pass |

The original development server on port 3000 was not stopped or replaced. Restart it to load dependency/configuration changes. The reference profiles use ports 3009–3011 and independent `.next-reference/<site>` build output.

## Visual evidence

The local visual artifact directory for this session is:

`/Users/dominicgarms/.codex/visualizations/2026/10/26/01a17704-7240-7550-a4d4-e8314add7b54/mui9/`

`report.html` contains the side-by-side captures. This directory is local evidence, not a committed baseline or a substitute for the existing Chromatic project's history.

`direct-review/report.html` records the subsequent navigation audit: 30 reviewed comparison states across 11 additional/deeper routes at 1280 × 720 and 375 × 812. Routes were reached through the main menus and page links; fresh loads were then used to verify SSR behavior. `observations.json` records viewport, document height and heading geometry. Historical failing captures are retained separately in the report and are not counted as passing states.

| Site | Deeper routes and interactions |
| --- | --- |
| Bali Internships | Volunteer conservation category → turtle conservation, Program Details/Benefits tabs; Questions → FAQ and expanded answer; Study → tropical ecology semester; Blog → category filter and article; Questions → Contact form rendering |
| Planet Training | Solutions → For Coaches; Pricing → yearly billing and two teams; mobile coach page |
| Upskill | Study Programs → sustainable tourism summer course; Information → Accommodation → Private Villa anchor; fresh mobile/desktop course load and Course Objectives expansion, including Enter-key activation |

The final Bali FAQ and Planet coach pages were reloaded after all fixes and retained the measured live document heights (4066px for the expanded desktop FAQ; 6128px for desktop coaches). Upskill's collapsed mobile course matches the live 13762px height, expanded mobile matches 14640px, and expanded desktop matches 8097px. Fresh local course loading produced no new console errors. Expanded mobile and desktop course captures, settled Planet mobile hero, and corrected Bali blog captures were pixel-identical when decoded. Other small differences come from rotating announcements, external embeds, loading transitions and transient scrollbars; raw pixel thresholds alone are not used as a pass/fail claim.

At 1280 × 720, decoded screenshots of button variants, form-select variants, and accordion presets were pixel-identical to the preserved React 18/MUI 5 Storybook build. The grid-alignment comparison had three pixels with channel differences greater than 10 (maximum 12/255), localized to an icon; layout and heading geometry matched after restoring the old font alignment. See `desktop-component-comparison.json`. The files named `.png` in this set contain JPEG data from the browser capture API; comparisons decode them before measuring.

At 375px, side-by-side component fixtures cover buttons, selects, grids and accordions. Reference-site checks use a real 375 × 812 viewport, plus 1280 × 720 desktop captures:

| Site | Routes / behavior checked |
| --- | --- |
| Bali Internships | Homepage, `/traineeship-bali-indonesia`, `/fees`; desktop menu and mobile drawer navigation; consultation dialog dismissal |
| Planet Training | Homepage, `/pricing`; desktop pricing navigation and mobile drawer; heading layout, paragraph color, pricing cards |
| Upskill | Homepage, `/application`; desktop Apply Now and mobile drawer; embedded application form rendering |

The captures inspect visible states, not every page, scroll position, browser or locale. Rotating banners, live chat popups, dynamic CMS lists and external embeds can differ independently of dependency changes. The older 13-route Bali audit predates this MUI migration and does not extend this migration's verified coverage automatically.

## Regressions found and corrected

- Grid2 removal / spacing changes: retained the old CMS layout algorithm on MUI 9 utilities, with nested-grid tests.
- Responsive heading alignment: restored the old 4px alignment at the largest breakpoint; heading-size assertions cover the measured baseline.
- Palette-path text colors: `secondary.main` was ignored by the new Typography color prop. The CMS renderer now uses `sx`, preserving both paths and legacy aliases. Planet pricing matches the live `rgb(104, 110, 118)` again.
- React 19 carousel defaults: explicit defaults fix Nuka's prerender failure and retain its existing behavior.
- Google Forms: corrected the select option label key and forwarded date field width/margins to the current picker field slot. Offline fixtures exercise these without network submissions.
- Storybook: removed an accidental context override that rendered a `<global>` element instead of component-based stories. Replaced the unavailable remote image fixture with a local attributed SVG.
- Cross-site tests: read the root directory when preparing each request, avoid mutating route arrays, and include space/language request parameters in the settings cache key.
- Development: Webpack's module parsing now accepts Fast Refresh syntax in CommonJS MUI/icon modules and Babel helpers.
- Desktop blog sidebar: replaced the removed docked-paper CSS selector with the Drawer paper slot. Bali's sidebar now stays below the app bar (z-index 1099), preserving access to Blog and Schedule Call. The mobile filter remains a normal modal overlay.
- Custom accordion SSR: the newer heading/button wrappers conflicted with CMS headings and interactive images. Custom summaries now retain div containers with MUI's keyboard/ARIA behavior; plain titles use span text within the native button. This removes React hydration error 418 and duplicated course sections. A parse5 regression test covers both a nested CMS heading and an image button. See the [MUI structural changes](https://mui.com/material-ui/migration/upgrade-to-v6/#accordion).

## Required before release

1. Direct live-site comparisons are complete for the scope above, as requested. If Chromatic is used as a merge gate, separately verify its existing baseline continuity and review differences with `yarn test:visual`; no remote check is claimed by this local audit. Do not auto-accept snapshots or bypass changed-snapshot failures. The latest rebuilt static Storybook is `/tmp/lumen-storybook-swiper14-final`.
2. The remaining published routes and translations are checked at 1280px/375px in Chromium. Complete any release-required Safari/Firefox and additional state/viewport checks; these are not covered by the route sweep. Apply the documented Planet consumer redirect patch with its upgrade.
3. Use a dedicated test Google Form to verify successful server acceptance if submission behavior needs release certification. Current tests validate encoding and local interaction; no production form was submitted. The retained no-cors response cannot prove acceptance by Google.
4. Establish required remote CI/branch checks; this checkout did not contain a GitHub Actions workflow and no branch protections were changed.

Non-fatal development warnings remain for legacy Next Link/ref behavior, CMS CSS keys using kebab-case, empty image sources, and font stylesheet placement. These are recorded rather than hidden with a console-error allowance. The deferred dependency families and legacy `base/` package are listed in the upgrade plan; this change does not claim every npm package is current.


## Wallet extraction — 27 October 2026

Wallet code is now in the independent sibling lumen-cms-web3 repository. Core production dependencies audit clean; all three builds, 1,496 page-prop comparisons and 10 production HTTP requests pass. Screenshots remain paused. See [web3-extraction.md](web3-extraction.md) and [verification evidence](web3-extraction-verification.json) for scope, remaining Storybook findings and artifact hashes.


## Unsupported integrations — 27 October 2026

Replaced the deprecated script hook with React-19-compatible @charlietango/hooks, replaced the used speech synthesis hook with a typed native wrapper, and removed unused next-safe while preserving response headers. All three production builds, 1,496 page-prop comparisons, 10 HTTP/header checks, 67 unit tests and TypeScript 7 pass. Screenshots remain paused. See [unsupported-integrations.md](unsupported-integrations.md) and [verification evidence](unsupported-integrations-verification.json).

## tss-react removal — 28 October 2026

Baseline before the migration: the full `feature/mui-v9` working tree (on top of `16c98d8`, including uncommitted and untracked files) is snapshotted as tag `pre-tss-react-migration` (commit `f2dc42c`, tree `1476a8d`) without moving the branch. The packed baseline is `/tmp/lumen-candidate-pre-tss-baseline.tgz`, SHA-256 `ec89005f0bac78b52711129edcb0c02e36f9334d3fdef1c2a507c79bc3f1f579`. The consumer UI parity run for baliinternships, planet-training and upskill is deferred; compare the post-migration candidate against this baseline and the live sites using the process in [visual-signoff-plan.md](visual-signoff-plan.md).

What changed: `tss-react` is removed and `@mui/material-nextjs@9.5.0` is added. Every `makeStyles` hook is now `sx`, `styled()` or MUI `GlobalStyles`. Storyblok style fields resolve through `getAdvancedSx`. Server rendering uses `documentGetInitialProps` and `AppCacheProvider` with the existing `css` cache key. Emotion style tags are still emitted through Next's `styles` slot, so they stay last in `<head>`, after the stylesheet links. `DocumentHeadTags` is not used, because React hoists its insertion-point `<meta>` to the top of `<head>`. The DOM gains `MuiBox-root` classes where plain `div` elements became `Box`; neither core nor the three consumer sites target that class. `Html` still renders without `lm-html__root`, matching the previous output, where `divProps.className` overwrote that class.

Raw CMS `css_properties` values would otherwise be reinterpreted by `sx` theme lookups. To prevent this, CMS declarations use kebab-case keys. Unitless `width`/`height` values up to 1 and palette paths in `color` were invalid CSS before, so they are dropped. A scan of 1,520 prerendered pages of the three consumers found no such values in use. `box_shadow: "0"` always appears with `elevation: "0"`, which takes precedence.

Local checks on 28 October:

- Both servers ran `next dev` from the baseline tag (via a temporary worktree) and the candidate, with the same Storyblok draft content. A Playwright script captured the computed styles and geometry of every element at 1280px and 375px.
- Bali Internships: `/`, `/info/faq`, `/blog-articles`, `/contact`, `/fees`, `/traineeship-bali-indonesia` and `/turtle-conservation-volunteer-bali-indonesia` show no differences after every phase. The only exception is the existing mobile-homepage carousel noise, which also appears between two baseline runs.
- Planet Training: `/`, `/pricing`, `/app-sports-coaches` and `/support` match.
- Upskill: `/`, `/sustainable-tourism-summer-course-bali`, `/accommodation-study-abroad-bali` and `/application` match. The only differences are inside the rotating announcement Swiper, which differs between baseline runs as well.
- Interaction states also match: the open left drawer (both widths, Bali and Upskill), expanded accordions (Bali FAQ, Upskill course), card and button hover, and the scrolled toolbar. The only exception is the opacity of an always-animating `span`.
- SSR emotion CSS on the Bali homepage is byte-identical after the server-rendering change.
- TypeScript 6 and 7, ESLint (0 errors; the same 97 warnings as the baseline), 144 unit tests, the Storybook build and a production `next build` pass.
- Production HTML keeps the emotion style tags last in `<head>`.

Candidate archive: `/tmp/lumen-candidate-no-tss.tgz`, SHA-256 `d801a41547693abaa2fbf5e0334bb72898c4b8d875d56b38a89dc575c9d51d69`. It also contains unrelated Storyblok data-fetching edits that were made in the working tree in parallel: `StoryblokService`, `pagesGetStaticPaths`, `api/clear-cache` and `traversePageContent`. Repack once those are settled if the consumer run should isolate the styling change. Still open: the full consumer route sweep against the live sites, Shopify and image-list lightbox states (not used on the inspected pages), Safari and Firefox.
