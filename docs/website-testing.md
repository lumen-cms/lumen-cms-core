# Website regression testing

## Repository assessment

The rewrite spans Next 16 / React 19 / MUI 9, Swiper 14, removal of tss-react,
Storyblok fetching and rich-text changes, forms, and shared layout components.
The repository already has offline Vitest tests, credentialed integration tests,
Storybook/Chromatic, consumer verification scripts, and historical visual audit
reports. These cover different failure modes; unit tests alone cannot establish
that published pages still look the same after the rewrite.

The previous website audit depended on a temporary Playwright installation,
manually built consumers, a separately generated inventory, and manual report
assembly. Its exit status did not gate visual differences. The `reference:site`
profiles switch CMS tokens but do not reproduce all consumer locales, redirects,
settings-path overrides, or custom components. The new commands automate the
actual-consumer workflow and turn comparison results into a test exit status.

## Setup and commands

Use Node 24 and the pinned pnpm version, with `pnpm install --frozen-lockfile` completed.
The default source is the sibling `../websites` checkout containing
`packages/baliinternships`, `packages/planet-training`, and `packages/upskill`,
their `.env` files, and its pinned `.yarn/releases/yarn-4.6.0.cjs`.

```sh
pnpm test:website:install  # Download Chromium once; Linux CI may also need OS libraries.
pnpm test:website:bali
pnpm test:website:planet
pnpm test:website:upskill
```

Each command runs 30 fixed public routes at 1280 × 720 and 375 × 812, for 60
comparisons. The manifest is `test/websites/sites.json`. It includes homepages,
listing/detail pages, FAQs, forms, pricing/fees, blog content and translated
routes, including all configured locales across the three sites. It was seeded
from the previous actual-consumer route inventory. A removed or broken route
fails instead of being silently replaced with an easier page.

```sh
# Inspect the selected routes without starting a server or making requests.
pnpm test:website:planet --list

# Faster targeted checks; --limit counts routes, not screenshots.
pnpm test:website:bali --limit 3 --widths 375

# A different consumer checkout, or set WEBSITE_CONSUMERS_ROOT.
pnpm test:website:upskill --websites-root /path/to/websites

# Compare an already-running, caller-managed local PRODUCTION build.
# This skips packing, installation, building, server ownership and cleanup.
pnpm test:website:planet --base-url http://127.0.0.1:3021

# Explicit tolerance, recorded in the report. Default is zero changed pixels.
pnpm test:website:bali --max-diff-percent 0.05

# Runner self-tests, including real browser fixtures for pass/fail exit status.
pnpm test:website:runner

# Retain the private temporary build for diagnosis after stopping its server.
pnpm test:website:upskill --keep-work
```

`--workers` defaults to 2 and accepts 1–3. `--widths` accepts comma-separated
widths from 320–1920. Width 375 uses height 812; other widths use height 720.
No route automatically becomes a baseline and no run updates the manifest.

## What a run does

1. Packages the current working tree's core source with `pnpm pack`, including
   uncommitted component changes. Records the archive SHA-256.
2. Copies only the selected actual consumer into a private temporary workspace.
   Preserves its configuration, custom components, aliases, and credentials.
   Migrates legacy credential variable names in that private copy to match the
   current core; public and preview credentials remain separate.
   Uses the existing preparation script's Next 16 config adaptations and Planet
   redirect compatibility fix. The source website checkout is read-only.
3. Installs the archive with the current core's React/Next versions and dependency
   resolutions. Runs the consumer's strict TypeScript check and production build.
4. Uses the existing `TEST` path limit with blocking fallback to avoid prerendering
   hundreds of unrelated pages. `next start` serves **published** CMS content;
   the selected paths render on demand. This is a sampled production-rendering
   test, not verification that every route can be statically built.
5. Starts the candidate on an available loopback port. Captures local/live pairs
   in the same Chromium version, timezone, locale, viewport, and device scale.
6. Scrolls through the page to activate lazy assets, waits for fonts/images,
   dismisses popups through their UI, disables screenshot animations, and stops
   Swipers at their first slide. Materializes legacy Nuka translation matrices
   only when the measured movement is at most 0.001 CSS pixels, avoiding
   percentage-transform rounding in justified text. Records those adjustments
   in `transformNormalizations`. Retains full-page images and metrics.
7. Writes the report, stops its server, removes the temporary consumer workspace,
   and returns zero only when every selected comparison passes. Each run has a
   new output directory, so stale successful captures cannot satisfy a new run.

Build/install/network failures stop the run and point to a stage log. Page-level
capture failures are collected while the remaining routes continue. A run does
not submit forms, book appointments, deploy, publish packages, upload screenshots,
or accept a remote visual baseline.

## Results and failure rules

Open the printed `report.html` directly in a browser; no report server is needed.
Artifacts live in the ignored `.website-tests/results/<site>/<timestamp>/` folder:

- `report.html`: live/local/difference images; differences expanded; images
  link to their full resolution. Pink marks unclassified changes; blue marks
  reviewed dynamic content.
- `summary.json` and `results.jsonl`: machine-readable outcomes and reasons.
- `inventory.json`, `candidate.json`, `run.json`: routes, candidate identity,
  capture settings and browser version.
- Per-case JSON and PNGs: title, headings and layout metrics, image problems,
  runtime errors, dynamic-region geometry, and raw screenshot evidence.
- Stage logs: package preparation, install, build, and server output.

A case fails for any non-2xx response, capture failure, differing redirect path,
page title or main heading content, screenshot dimensions, new browser errors,
new broken images, additional horizontal overflow, or incomplete visible assets.
Existing live browser errors and broken images remain visible in the report.
Matching 404/500 pages are failures, never successful visual comparisons.

Pixel comparison ignores RGB channel differences of at most 16/255; above that,
**any unclassified changed pixel fails by default**. `--max-diff-percent` relaxes only the
changed-pixel percentage. It does not relax dimension or health checks. Main
heading assertions cover h1/h2; all h1–h4 metrics are retained. MUI's additional
h3 accordion wrappers are not a text regression by themselves.

## Dynamic content and confirmed regressions

Cases have three outcomes: `passed` (no differences above the channel noise
threshold), `dynamic-only` (all changed pixels belong to reviewed dynamic
regions), and `failed`. Only the first two return a successful exit status.
The raw images and raw difference percentage are always retained.

The reviewed exceptions in `scripts/website-dynamics.cjs` are deliberately narrow:

- Upskill's top announcement: matching slide text, typography and geometry.
  CMS body carousels are never excluded by this rule.
- Animated GIFs and autoplay videos: matching source, geometry, crop, borders
  and video controls. A missing, resized or differently styled region fails.
- HubSpot meeting embeds: matching iframe URL, title and geometry; availability
  and times inside the external iframe can vary.
- Known fixed chat overlays, including the Chatwoot button's shadow: these may
  arrive at different times and do not participate in document layout.

Two component regressions were reproduced and fixed during the first review:

- Bali's tab content inherited centered alignment after the Nuka-to-Swiper
  migration. The adapter now restores Nuka's left-aligned slide default while
  allowing child components to override it. This restores the Apply Now buttons
  on architecture, turtle conservation and two study-program detail pages.
- Upskill's CMS Swipers had SSR disabled. Delaying the nested slide chunk left
  initialized carousels with empty slides and zero height. Enabling SSR preserves
  their content before hydration. In the production-build slow-chunk check,
  the two mobile homepage carousels retained heights of 304.734375px and
  87.875px before and after the six-second delay; the old build rendered both
  at zero height until the chunk arrived.

Both changes have component regression tests. The runner also tests that
dynamic regions cannot conceal static changes, HTTP errors or changed geometry.
The SSR test exercises the actual lazy CMS registry as well as the component.
The legacy-transform test verifies that a real 0.25px position stays untouched.

The October 29 investigation also distinguished two capture effects from these
regressions: legacy Nuka's 0.00006–0.00024px horizontal rounding changed a handful
of justified glyph pixels, and delayed external embeds/fonts occasionally
produced different captures on an unchanged build. The first is normalized as
described above; the second remains a strict failure if it occurs. A successful
targeted retry is evidence of intermittency, not a replacement for the failed
full-run report. No broad pixel tolerance or automatic retry acceptance is used.

## Practical limits

Live CMS edits, delayed chat bubbles, video/iframe content, announcement timers,
and third-party availability can cause differences. Exceptions above are shown
explicitly in the report; other changes remain failures. Review the paired
images and dynamic-region metadata, then
rerun affected routes before attributing a difference to core code. A strict
failure means the pages differ or comparison was incomplete; it does not alone
prove a component regression. Review small differences before relaxing tolerance.

This suite covers fresh page loads and full-page appearance in Chromium. It does
not claim Safari/Firefox coverage, all interactive states, form delivery, or
complete website coverage. Menu navigation, accordion expansion, pricing toggles,
and actual form submission require separate interaction tests. The existing
unit/integration suites and Storybook checks remain relevant.

Production content can also change between the local render and live capture.
The report records timestamps and the candidate hash; `--base-url` runs explicitly
identify the build as caller-managed rather than claiming an archive identity.
Temporary workspaces are removed on normal completion, including failed tests,
unless `--keep-work` is used. Retained builds contain copied consumer credentials;
keep them private and remove them when diagnosis is finished.
If the process is forcibly interrupted, it may leave a private
`lumen-website-<site>-*` directory in the OS temporary directory. Captures and logs
are retained until removed manually and can use substantial disk space.

## Approved search renderer change (2026-10-29)

`list_search_autocomplete` intentionally changed from an inline autocomplete to
an input-looking opener for a shared Cmd+K / Ctrl+K dialog. This applies to Bali
Internships and every consumer using that component. Its mobile icon opens the
dialog directly. Search is limited to regular pages and landing pages (both use the CMS `page`
type); news, events and documents are excluded.
Do not restore the legacy dropdown to satisfy a live-site comparison.

The runner records this migration in `scripts/website-expected-changes.cjs`.
Candidate controls expose explicit version, label, placeholder and mode markers.
Legacy controls must match both the known autocomplete markup and a corresponding
CMS component in `__NEXT_DATA__`; generic form autocompletes are not exempted.
Only a uniquely paired legacy/new control with matching labels and mode qualifies.
Height and vertical position must match within 1px; the width may stay equal or
change from the legacy 180px to the new 220px desktop opener, with one horizontal
edge fixed.
Missing controls, ambiguous matches and other geometry changes remain failures.

Only pixels inside the two control boxes are accepted. Surrounding navigation,
page layout, open dialogs, screenshot dimensions and health checks remain strict.
Reports preserve raw screenshots and explicitly record `expectedChanges` and
`expectedChangePixels`; these use the existing `dynamic-only` successful outcome
and blue reviewed-pixel overlay. Once both sides have the new renderer, this
migration exception stops masking pixels and strict comparison resumes.

The component's `SearchPalette.test.tsx` covers dialog interactions, shortcuts,
mobile behavior and search responses. `test/websites/search-change.test.cjs`
verifies detection and the boundaries of this visual exception. Run
`pnpm test:website:runner` to validate the regression runner itself. Full consumer
comparisons still require the normal production-build website commands above.

### Search browser integration tests

```sh
pnpm test:integration src/components/list-widget/SearchPalette.integration.test.tsx
```

These credential-free Chromium tests build an isolated fixture from the actual
search renderer, provider, MUI dialog, SWR hook and Storyblok transport. Storyblok
HTTP responses are intercepted; unexpected external requests fail the tests.
A minimal Next routing adapter allows real browser anchor navigation without
building a consumer application. This checks component integration, not Next.js
client-side routing or a deployed site's CMS configuration.

Desktop (1280×720) exercises Enter activation, Cmd+K/Ctrl+K, a single shared
dialog, focus containment/restoration, query reset and keyboard result selection.
Mobile (375×812 with touch enabled) exercises the responsive icon, direct
fullscreen opening, dismissal and touch result selection. Both verify the
two-character minimum and the published, locale-scoped request restricted to `page` content, including
landing pages and excluding news, events and documents. Browser errors fail the test. The fixture server and build output
are temporary and cleaned up after the suite. Install Chromium first with
`pnpm test:website:install` if necessary.
