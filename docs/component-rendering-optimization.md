# Component rendering optimization — 29 October 2026

Pages Router, `getPageProps`, page data, CMS component names, public exports,
and consumer registration overrides are retained. The resolver itself still
uses the existing component lookup and forwards the same props.

## Changes

- Unrelated slider/image-list/tab, search/snackbar, video, HubSpot and list/card
  blocks no longer share manually named chunks. Webpack extracts common dependencies.
- Chat integrations, standalone cards, news/events and iframes use SSR-enabled
  dynamic registrations. Both iframe names share one registration. Common
  layout/typography/navigation/rich-text blocks and small form/dialog wrappers
  remain eager. Existing explicit SSR exceptions remain unchanged.
- Browser search imports a published-only adapter when a fetch runs. The adapter
  and server service share transport, normalization, retries, metadata and bounded
  relation/link resolution. Server caches, draft policy, full-list fetching and
  the rich-text facade remain in the service.
- Preview bridge initialization/subscriptions load only inside Storyblok. Both
  the module load and bridge load can be cancelled on unmount. Editable markers
  keep their existing DOM structure and continue tracking lazy component roots.

## Production measurements

The baseline was packed from the working tree immediately before implementation,
including its existing uncommitted changes. Both archives were built in isolated
copies of the three real consumers with their own configuration. Builds used
`TEST=TRUE` with blocking fallback; they are sampled builds, not an all-route audit.
Archive hashes and raw measurements are in
[component-rendering-verification.json](component-rendering-verification.json).
Subsequent unrelated edits arriving in the shared workspace are outside the
measured candidate archive.

| Shared app + catch-all JS | Before, gzip KiB | After, gzip KiB | Saved |
| --- | ---: | ---: | ---: |
| Bali Internships | 330.2 | 310.9 | 19.3 |
| planet.training | 330.6 | 311.1 | 19.6 |
| Upskill | 330.6 | 311.1 | 19.6 |

Diagnostic pages include the same app providers and real settings in both builds.
The slider-only page saves about **29 KiB gzip**, and the snackbar-only page saves
about **76 KiB gzip**. Client module graphs confirm that slider pages exclude the
tabs/image-list implementations and snackbar pages exclude search implementations.
Public fixtures exclude the browser transport, full service and preview bridge.
The checker also rejects the unoptimized baseline as expected.

Actual desktop homepage downloads captured in Chromium:

| Site | Before JS, gzip KiB / requests | After JS, gzip KiB / requests |
| --- | ---: | ---: |
| Bali Internships | 453.4 / 16 | 431.8 / 25 |
| planet.training | 373.2 / 13 | 356.4 / 15 |
| Upskill | 381.6 / 13 | 362.1 / 19 |

These gzip values sum only the requested local JavaScript files; HTML-based
fixture totals also include script tags the browser may skip, such as nomodule
polyfills. Splitting creates more small requests while reducing transferred code.
Scrolling these sampled homepages did not request additional JavaScript.

On Bali's desktop listing, actual autocomplete typing returned the same 14 results
and successful space/story requests in both builds. The candidate loaded two
additional search chunks totaling **16.5 KiB gzip only after typing**; the baseline
already included its search transport. The recorded search run went from
420.0 KiB / 13 initial requests to 397.8 KiB / 22 initial requests, followed by
those two deferred requests. This distinguishes deferred bytes from bytes removed.

Local single-sample desktop homepage LCP values were 636→368 ms, 168→236 ms,
and 308→320 ms respectively. CLS samples were unchanged. These samples vary with
server/cache/network conditions and do not establish a general LCP or INP improvement.
The JSON records DCL, LCP, CLS, encoded script bodies and initial/additional JS
separately for each browser sample.

## Verification

- All three baseline and candidate consumer builds passed their TypeScript and
  Next.js production checks. All **33 generated page-data payloads** matched
  through the existing comparison gate (which normalizes its two established
  volatile fields).
- **27 browser comparisons / 54 samples** cover the three fixtures plus homepage,
  listing/pricing and FAQ pages at desktop/mobile sizes. Headings and successful
  status codes match; no new browser errors, horizontal overflow or preview
  downloads were observed. The long Bali listing matches after settling; Planet's
  mobile homepage differs by one pixel in total document height.
- The optimized Bali mobile drawer opens and navigates to `/fees` without a
  document reload or browser errors. Real autocomplete keystrokes produce the
  same results as the baseline; slider navigation and lazy dialog opening also
  have passing component regression tests.
- Existing service/page-data/rich-text/slider checks and new rendering, adapter,
  list-fetch lifecycle and preview checks passed: **194 tests** at the initial gate.
  The final working-tree run passed **209 tests / 49 files**, including concurrent
  additions. Type checking passed. The new dialog regression test verifies that
  its trigger remains mounted and its body loads only on opening.
- Storybook production build passed. Lint passed with existing warnings.
  Changed files pass formatting; the repository-wide format command initially
  flagged the unrelated `traversePageContent.test.ts` file.
- Editor updates, reload events, lazy-root annotations and cancellation are tested
  with mocked bridge events. An authenticated Storyblok editor session was not
  exercised. Screenshots were inspected for representative pages; this is not
  an exhaustive pixel-diff certification of every site route.

## Repeating the bundle checks

Prepare fresh baseline and candidate consumer workspaces using
`scripts/prepare-consumer-verification.cjs`, each with its own packed core archive.
Before building either workspace, add diagnostic routes and module stats:

```sh
node scripts/prepare-component-bundle-fixtures.cjs /tmp/baseline-consumers
node scripts/prepare-component-bundle-fixtures.cjs /tmp/candidate-consumers
```

Install dependencies and run the existing production build in each of the three
consumer packages with `TEST=TRUE`. Then run:

```sh
node scripts/check-component-bundles.cjs \
  /tmp/baseline-consumers /tmp/candidate-consumers /tmp/component-bundles.json
pnpm test:page-data /tmp/baseline-consumers /tmp/candidate-consumers
pnpm test
pnpm check-types
pnpm lint:code
pnpm build-story
```

The fixture preparation script accepts only isolated verification workspaces and
refuses duplicate preparation. It does not add routes to the core's `src/pages`
or modify the original website consumers. Bundle checks fail if expected renderer
modules are missing, unrelated implementations are loaded, preview/search transport
enters public fixtures, or shared gzip JavaScript does not decrease.

Diagnostic fixtures now enable browser source maps instead of a webpack stats plugin.
Keep these builds local. The comparison script still accepts historical webpack
`client-stats.json` baselines, and reads source maps for Turbopack candidates.
