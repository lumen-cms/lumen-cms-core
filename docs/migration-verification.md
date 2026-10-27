# React 19 / MUI 9 migration verification

Branch: `feature/mui-v9`. Updated: 27 October 2026. Status: local migration candidate; **not approved for release**. Prepared as a local migration checkpoint; not deployed.

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

The final package is `/tmp/lumen-candidate-v9.tgz`, SHA-256:

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
| Production builds | All three actual consumers pass full production builds with the final v9 archive and TypeScript checking |
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

1. Direct live-site comparisons are complete for the scope above, as requested. If Chromatic is used as a merge gate, separately verify its existing baseline continuity and review differences with `yarn test:visual`; no remote check is claimed by this local audit. Do not auto-accept snapshots or bypass changed-snapshot failures. The final rebuilt static Storybook is `/tmp/lumen-storybook-v9`.
2. The remaining published routes and translations are checked at 1280px/375px in Chromium. Complete any release-required Safari/Firefox and additional state/viewport checks; these are not covered by the route sweep. Apply the documented Planet consumer redirect patch with its upgrade.
3. Use a dedicated test Google Form to verify successful server acceptance if submission behavior needs release certification. Current tests validate encoding and local interaction; no production form was submitted. The retained no-cors response cannot prove acceptance by Google.
4. Establish required remote CI/branch checks; this checkout did not contain a GitHub Actions workflow and no branch protections were changed.

Non-fatal development warnings remain for legacy Next Link/ref behavior, CMS CSS keys using kebab-case, empty image sources, and font stylesheet placement. These are recorded rather than hidden with a console-error allowance. The deferred dependency families and legacy `base/` package are listed in the upgrade plan; this change does not claim every npm package is current.
