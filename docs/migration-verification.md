# React 19 / MUI 9 migration verification

Branch: `feature/mui-v9`. Updated: 27 October 2026. Status: local migration candidate; **not approved for release**. Prepared as a local migration checkpoint; not deployed.

## Actual consumer verification — 27 October

The subsequent pass used isolated copies of the real `bi`, `pt`, and `upskill`
consumers in `/tmp/lumen-consumer-mui9`, rather than the core's token-only smoke
profiles. Each `.env` remains byte-for-byte identical to the corresponding
original consumer. Planet's locale suppression, fallback mode and support/Hilfe
settings paths were preserved, as were every consumer's locales and redirects.
The original `../websites` checkout remains clean and port 3000 was untouched.
Token validation is recorded without values in
[reference-environment-validation.json](reference-environment-validation.json).

All three **full production builds**, with TypeScript checking enabled, passed
against the same final `candidate-v6.tgz` archive:

`26b8273ccd18e0c77914f871b5e9db5918e8ad3ce475a8257e4a8fe0043816d9`

Their prerender manifests contain 597 Bali, 694 Planet and 205 Upskill routes.
These are build counts, not counts of visually inspected pages. The isolated
consumers use TypeScript 7's native binary explicitly and TypeScript 6.0.3 for
tools needing the JS compiler API; Yarn 4's builtin patch failed on the core's
compatibility alias. Strictness was not disabled to obtain passing builds.

The browser pass saved **82 full-page live/local pairs across 33 URL paths**,
six additional viewport-state pairs, and 18 breakpoint comparisons. Of the
full-page pairs, **56 are decoded pixel-identical**. All recorded final page
heights match and no horizontal overflow was detected. This is representative
coverage, not exhaustive certification of the 1,496 generated routes.

Coverage includes desktop/mobile main-navigation journeys, all configured locale
homepages, Bali listing/detail/blog/filter/FAQ/form pages, Planet pricing and
English/German support, and Upskill courses/accommodation/deadlines/fees/forms.
Additional 320, 768 and 1440px checks target fee, pricing and course templates;
navigation geometry matches at 599/600, 899/900 and 1199/1200px. The extra-width
captures used a 720px viewport height. The connected in-app browser was used;
its exact engine build was not recorded. Published CMS content was compared
live rather than pinned to a frozen CMS revision.

Two additional visual regressions were fixed:

- Empty MUI start-icon slots introduced a blank line in block-style Bali buttons.
  Suppressing their pseudo-element restores the 36.5px button height while
  retaining inline margins. The homepage's cumulative 74px shift is gone.
- MUI's new `text-align: start` on accordion content overrode inherited alignment
  for custom CMS titles. At 320px, Upskill's wrapped credit-transfer title now
  centers like live. The override applies only to custom titles: a shared-page
  recheck caught and removed an intermediate change to plain FAQ alignment.

Storybook play cases for block-button height, wrapped custom-title alignment,
and Google Form required validation/dropdown selection pass. TypeScript, ESLint,
21 Vitest tests in 11 files, and the static Storybook build pass. Packed-consumer
checks also required portable Swiper declarations and explicit analytics globals.
The Swiper declaration copy retains its MIT license and does not change runtime.

Webpack initially reused stale code from an earlier same-version package archive.
The final builds cleared `.next/cache`; the preparation script now does this on
each verification build. Screenshots made against stale code were superseded.
The broad sweep used v3; the final custom-title fix and affected shared pages were
rechecked with v6. Raw observations retain intermediate attempts with timestamps;
the report uses the latest capture per case and labels the candidate.

Evidence is in the session artifact directory's `signoff/report.html`, alongside
`observations.json`, `pixel-results.json`, `breakpoint-results.json` and
`route-inventory.json`. The inventory combines build routes and observed links;
complete sitemap reconciliation is still pending. Remaining image differences
include rotating logos/announcements, chat prompts, media/hover timing, transient
scrollbars and full-page capture alignment. They are retained for review, not
hidden by accepting a new baseline. Two unloaded image elements on Bali's German
mobile homepage occur on both live and local. `/hilfe` without `/de` is an existing
404 on both; the actual German support destination `/de/hilfe` matches.

Safari and Firefox remain unavailable through the connected browser tools.
Remaining routes, translated detail templates, wider state/viewport coverage and
verified receipt of a real test Google Form response are still release follow-ups.
No production form submission, deployment, package publication or remote baseline
acceptance was performed.

## Checks

| Check | Result / scope |
| --- | --- |
| TypeScript 7 | Strict check passes; no disabled strictness checks |
| ESLint | Passes |
| Vitest | 21 tests in 11 files pass, including browser HTML parsing of custom accordion titles |
| Storybook 10 | Static build succeeds; existing controls render and reset |
| Offline Google Forms | Required validation, dropdown choice, multi-select choice, calendar selection checked in the browser; automated validation/dropdown `play` story completes |
| Production builds | Bali, Planet and Upskill smoke profiles succeed; limited static paths plus on-demand navigation |
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

1. Direct live-site comparisons are complete for the scope above, as requested. If Chromatic is used as a merge gate, separately verify its existing baseline continuity and review differences with `yarn test:visual`; no remote check is claimed by this local audit. Do not auto-accept snapshots or bypass changed-snapshot failures. The rebuilt static Storybook is `/tmp/lumen-storybook-react19`.
2. Verify the remaining site routes, translated detail templates, interactive components and browser support. MUI 9's supported browser floor must fit the sites' users. Full builds and representative actual-consumer checks are now complete as documented above; exhaustive visual coverage and Safari/Firefox are still pending.
3. Use a dedicated test Google Form to verify successful server acceptance if submission behavior needs release certification. Current tests validate encoding and local interaction; no production form was submitted. The retained no-cors response cannot prove acceptance by Google.
4. Establish required remote CI/branch checks; this checkout did not contain a GitHub Actions workflow and no branch protections were changed.

Non-fatal development warnings remain for legacy Next Link/ref behavior, CMS CSS keys using kebab-case, empty image sources, and font stylesheet placement. These are recorded rather than hidden with a console-error allowance. The deferred dependency families and legacy `base/` package are listed in the upgrade plan; this change does not claim every npm package is current.
