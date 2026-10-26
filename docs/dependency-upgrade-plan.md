# Dependency upgrade plan

Keep the existing website designs and behavior while moving maintained dependencies to current releases. React 19 and TypeScript 7 are required targets; replace Jest and ts-jest with Vitest, and retain GraphQL 16 by explicit choice. Include Material UI in the target, but migrate its layout and form dependencies as one coordinated project. Ship each dependency batch only after it passes the same production and visual checks as the previous batch.

This plan and its registry audit were prepared on 26 October 2026. The table below records the pre-implementation audit, not the current installation. Exact targets must be rechecked when each batch starts.

## Implementation checkpoint: React 19 / MUI 9

Work is on `feature/mui-v9`, based on `feature/mui-v5`. The migration checkpoint is local; nothing has been pushed, published or deployed. This is a migration candidate; visual release approval is still required.

| Family | Current installation |
| --- | --- |
| Next.js / bundle analyzer | 16.4.3; Pages Router and Webpack retained |
| React / React DOM | 19.3.1 |
| MUI material / system / utils / icons | 9.5.0 |
| MUI Lab / MUI X date pickers | 9.0.0-beta.10 / 9.16.0 |
| React Hook Form / MUI wrapper / date-fns | 7.91.0 / 9.0.1 / 4.4.0 |
| Storybook / Chromatic | 10.6.3 / 18.13.3 |
| Vitest / Vite | 5.0.5 / 8.3.5 |
| TypeScript compiler / API compatibility package | 7.0.2 / 6.0.2 |
| GraphQL | 16.14.2 (17 intentionally excluded) |
| Node | 24, pinned in `.nvmrc` |

TypeScript 7 currently does not expose the compiler API used by ESLint and other tools. Following [Microsoft's side-by-side setup](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-60), `@typescript/native` aliases TypeScript 7.0.2 and provides `tsc`, while `typescript` aliases `@typescript/typescript6` 6.0.2 for API consumers. `check-types`, `build`, and reference production builds run the TypeScript 7 gate. Jest and ts-jest are removed; strict checking remains enabled.

### Compatibility work implemented

- Ported the MIT MUI 5 Grid2 spacing algorithm into `src/vendor/grid`, using MUI 9 public styling utilities. This preserves CMS grid props, nested spacing, negative margins, and vertical grids without installing MUI 5.
- Preserved MUI 5 responsive font alignment and ListItemIcon gutters. Browser comparisons caught a heading-size change and a real Planet pricing text-color regression. CMS palette paths now go through Typography `sx`; legacy aliases remain supported.
- Migrated removed MUI system props, component slots, tabs selectors, and list buttons. Date pickers use the supported entry point and field slot props; Google Forms select options use the wrapper's current label key.
- Explicitly applied Nuka Carousel's original defaults because React 19 no longer applies function-component `defaultProps`. This fixes a production prerender failure while retaining the existing carousel presentation.
- Vendored the used MIT Google Forms types and submission helper in `src/vendor/google-forms`. The existing server parser and MUI renderer remain; no extra service or credentials were added. This is a local maintained subset, not a published npm fork. Payload encoding is covered by offline tests; no real forms were submitted.
- Migrated Storybook to its Next.js framework, replaced addon-knobs with a local compatibility controls panel, retained story IDs, fixed component-story rendering, and replaced the broken remote Twitter image fixture with an attributed local SVG.
- Added offline Google Forms stories at 375px and 1280px, including a required-validation/dropdown interaction test. Live CMS tests are separate from offline tests.
- Isolated reference-site build output and credentials. Fixed request root-directory handling and settings cache keys so switching Storyblok spaces does not reuse another site's settings. The old integration-fixture names do not reliably identify these three websites; reference profiles are separate and their actual spaces were verified.

### Verification and release status

Twenty-one offline Vitest tests cover parsing and payloads, CMS request/cache isolation, grid layout rules, responsive typography, CMS colors, carousel SSR, custom accordion HTML parsing, news output and signing. TypeScript 7 and ESLint pass. Storybook builds. Production smoke builds are checked for all three reference profiles; `--smoke` uses the existing limited path selection and does not exhaustively prerender every CMS route.

The detailed scope and remaining checks are recorded in [migration verification](migration-verification.md). Component screenshots were compared against a preserved React 18/MUI 5 Storybook build. Reference checks include the three homepages and navigation to Bali internships/fees, Planet pricing and Upskill application. Live content, rotating banners, and external chat widgets prevent treating raw whole-page differences as styling failures automatically.

The user chose another direct website comparison pass. It covers 30 reviewed states across 11 deeper routes and found two additional regressions: a desktop sidebar obscuring the navigation, and invalid accordion HTML duplicating content on fresh loads. Both are fixed and rechecked on the final production builds. No Chromatic baseline was accepted. `yarn test:visual` remains available without automatic baseline acceptance; remote baseline continuity is unverified. Full site/mobile coverage, production submissions, and consumer-package installations are not signed off by these checks.

The remaining dependency batches below are still a roadmap: Storyblok SDK/editor integration, ESLint tooling, media/carousel major versions, wallet packages, code generation and legacy `base/` distribution have not all been upgraded. Keeping those changes separate reduces the number of simultaneous visual and behavioral changes.

## Initial audit: state and target versions (historical)

The root manifest contains 125 unique direct dependencies across runtime, development and peer dependencies. Of these, 106 installed versions differ from their package's npm `latest` tag. The [package audit](dependency-upgrade-audit.json) records installed versions, published targets, peer requirements, proposed batches and exceptions. A Git dependency is tracked separately from registry releases.

| Package or family | Installed | Published latest | Planned treatment |
| --- | --- | --- | --- |
| Next.js and bundle analyzer | 16.2.4 | 16.4.3 | Update together; retain Webpack initially |
| React and React DOM | 18.2.0 | 19.3.1 | Required final target; 18.3.1 may be an intermediate migration step |
| MUI material and utils | 5.12.3 | 9.5.0 | Migrate through the documented 5 → 6 → 7 → 9 changes |
| MUI icons | 5.11.16 | 9.5.0 | Align with MUI material |
| MUI X date pickers | 6.3.1 | 9.16.0 | Coordinate with form wrappers and date adapter |
| react-hook-form | 7.43.9 | 7.91.0 | Update and verify field state and payload behavior |
| react-hook-form-mui | 6.0.1 | 9.0.1 | Upgrade with the MUI 9 stack |
| date-fns | 2.29.3 | 4.4.0 | Migrate adapter and locale imports with pickers |
| mdi-material-ui | 7.6.0 | 8.0.0 | Latest declares MUI 9 compatibility |
| tss-react | 4.8.2 | 4.9.21 | Latest declares MUI 9 compatibility; preserve style insertion order |
| Storybook React | 6.5.13 | 10.6.3 | Migrate framework and addons; preserve story identity |
| Chromatic | 6.11.3 | 18.13.3 | Update with Storybook and validate baseline continuity |
| Storyblok JS client | 7.1.5 | 7.8.1 | Update separately from renderer replacements |
| TypeScript | 5.7.3 | 7.0.2 | Required target; remove the ts-jest constraint by adopting Vitest |
| Vitest | Not installed | 5.0.5 | Replace Jest, ts-jest and Jest-specific test types |
| Vite | Not a direct dependency | 8.3.5 | Install explicitly for Vitest under Yarn; Next retains Webpack |
| GraphQL | 16.6.0 | 17.0.2 | Remain on 16; target 16.14.2, with no GraphQL 17 migration in scope |

Registry metadata and source URLs for these figures are preserved in the audit. Peer compatibility is necessary but does not prove runtime or visual compatibility.

## Material UI decision

Include MUI 9 in the upgrade scope. `react-hook-form-mui@9.0.1` requires MUI material, system and icons 9, MUI X date pickers 9, React Hook Form at least 7.62, and React at least 18. The current releases can therefore form a compatible target without simultaneously requiring React 19. Declare `@mui/system` directly where needed to satisfy the wrapper's peer contract. See the [published wrapper requirements](https://registry.npmjs.org/react-hook-form-mui/9.0.1).

The largest regression risk is the repository's layout code, rather than the form wrapper's peer requirements:

- Fourteen files import `@mui/material/Unstable_Grid2`. `GridRow`, `GridColumn`, `CardList` and `Section` also depend on old grid classes, spacing and nested layout behavior.
- The MUI 6 migration changes Grid sizing and offset props and replaces its spacing mechanism with CSS gap. Reproduce the current widths, gutters, reverse ordering and background positioning explicitly. See the [MUI 6 migration](https://mui.com/material-ui/migration/upgrade-to-v6/).
- MUI 9 removes column-direction Grid support and changes the default ListItemIcon width. Vertical layouts in `FormBuilder` and section components need Stack or a compatible flex wrapper; theme overrides should retain the existing icon spacing. Also review removed props, slots, keyboard handling and icon names. See the [MUI 9 migration](https://mui.com/material-ui/migration/upgrade-to-v9/).
- Pickers 9 require their accessible field DOM. Match existing labels, field height, helper text, focus styling and calendar layout while preserving the new accessible semantics. See the [picker migration](https://mui.com/x/migration/migration-pickers-v8/).
- Keep Emotion and tss-react for this upgrade. Verify server-rendered CSS, style ordering and hydration. A styling-engine rewrite would add an independent source of visual changes.

MUI Lab remains a beta package: use its compatible v9 beta for the existing tabs and timeline, recording this exception to the stable-only policy. MUI 9 also raises the supported browser floor, including Safari 17; check site analytics and the supported-browser policy before adopting that floor. If older Safari remains required, MUI needs an explicit version exception rather than an unsupported deployment.

## Initial gate findings (historical; foundation issues now resolved)

At the initial audit, the checks were not a green baseline:

- `yarn check-types --incremental false` reports 215 errors: 119 unused declarations, 78 string-indexing errors and 18 other errors. Fix these without disabling type checking or broadly replacing types with `any`.
- A direct `build-storybook -c .storybook` probe exits with a browser-bundle resolution error for Node `fs` through Next's compiled gzip-size module. This probe did not copy `.storybook/.babelrc` into the repository root as the current script does. Repair and validate the canonical build in isolation; do not claim that this probe fully reproduces its behavior.
- Storybook uses old router mocks, a private Next RouterContext import, addon-knobs, Emotion aliases and scripts that copy/delete the root Babel configuration. Modernize the framework integration and remove these cross-command side effects.
- Existing Jest tests include live CMS/Google Forms requests. Port all four test files to Vitest and separate deterministic fixture tests from live integration smoke checks. Preserve assertions and test coverage during the migration.
- No `.github` workflow directory is present in this checkout. Configure CI checks and inspect actual remote branch protection before calling visual review mandatory.

The previous Bali browser comparison covered 13 routes and 26 states without a confirmed styling regression. It used the development server, and local draft content included an extra Wellness category. This is useful evidence, but it does not replace the production baseline for all three reference sites.

## Upgrade roadmap and remaining batches

1. **Baseline and test infrastructure.** Save the current lockfile and known-good screenshot baseline. Migrate Jest to Vitest, fix type errors under TypeScript 7 and repair Storybook integration. Migrate Storybook in documented major-version stages to `@storybook/nextjs@10.6.3`, initially using Webpack. Replace knobs with args/controls and the old router addon with framework mocks; remove obsolete manager/essentials packages rather than updating each independently. Keep story IDs and validate old versus new Storybook output with identical component code and fixtures. Update Chromatic and add production browser tests. Pin the Node 24 runtime and Yarn version in development and CI; evaluate the Yarn update separately from runtime dependencies. Use the [Storybook migration guides](https://storybook.js.org/docs/releases/migration-guide).

2. **Next and lower-risk utilities.** Update Next, analyzer and `eslint-config-next` to 16.4.3. Migrate ESLint configuration and compatible plugins together; keep formatter-only changes separate. Update compatible utilities and type packages in small groups using the package audit. Preserve Pages Router, existing routes, image handling, CSP, locale redirects and Webpack while testing. Verify `yarn dev`, production build/start, SSR, metadata, optimized images and hydration. Replace or isolate `next-safe` if its unsupported Next peer contract cannot be resolved; preserve the response headers it currently generates.

3. **CMS and obsolete dependencies.** Update the Storyblok client, schema tools and rich-text dependencies deliberately. Replace deprecated `storyblok-react` with a maintained editor integration, preserving editable attributes and the rendered DOM. Replace deprecated use-script, remove redundant types after their libraries supply types, and remove browser polyfills only where the supported browser floor permits it. Audit the blanket node-fetch v2 resolution and prefer supported native fetch where behavior is equivalent. Preserve publishing/preview behavior and content transformations.

4. **MUI and forms.** First add missing visual and interaction coverage on the existing stack. Update Emotion/tss-react and make layout compatibility changes in reviewable steps. Apply the documented MUI migrations, updating class selectors and component props manually where codemods cannot understand CMS-driven values. Reach the coordinated MUI 9, wrapper 9, picker 9 and React Hook Form 7 targets. Validate every site after each layout step. If React 18 is still used, handle the documented react-is alignment requirement at the relevant MUI stages.

5. **React.** Reach React 19; do not leave React 18 as the final state because of old peer declarations. First retain and test `react-google-forms-hooks`: this repo imports its types and `submitToGoogleForms`, uses its own parser and renders through React Hook Form MUI. The submission helper itself has no React calls. This supports compatibility as a hypothesis, not a completed runtime test. Verify package import/bundling, field rendering, validation, date and multiselect payloads, honeypot behavior and submission handling under React 19. Keep this integration simple: use a maintained fork of the existing package when upstream cannot supply the tested React 19 support. Preserve its API and rendering behavior, fix only demonstrated compatibility issues, and publish corrected peer metadata after tests pass. Avoid a new Forms API, Apps Script service or renderer replacement for this upgrade. Review `react-speech-kit`, `storyblok-rich-text-react-renderer-ts` and the deprecated script-hook package similarly. Move React, React DOM, their type packages and why-did-you-render together. Test refs, portals, dialogs, hydration, strict-mode behavior and editor integration.

6. **Remaining maintained dependencies.** Upgrade media/carousel/animation, calendars, state and GraphQL/codegen as separate families. Swiper 8 → 14, Nuka 5 → 8, React Player 2 → 3, Zustand 4 → 5 and marked 4 → 18 need release-specific source changes and feature tests. Preserve slide sizing, playback/autoplay, responsive behavior, calendar dates and rendered HTML. Keep GraphQL on the latest compatible 16.x release as an accepted final-state exception. TypeScript 7 is covered by the Vitest migration in the first batch; do not retain ts-jest or a TypeScript 6 hold.

7. **Optional integrations and distribution.** Update wallet/Auth0/ecommerce dependencies with mocked integration tests; ethers 5 → 6 and WalletConnect 1 → 2 are API migrations. Check direct imports and script binaries for accidental reliance on transitive dependencies. Determine whether `base/package.json` is an active published product: it still declares Next 9, React 16 and Material UI 4. If active, give it the same migration and consumer tests; if obsolete, retire it explicitly. Validate the root package's exported source, peer ranges and packed contents in consumer installations for all three sites. Publish a major package release if the new peer requirements break the existing consumer contract.

Each batch gets its own reviewable diff and lockfile change. If a batch fails the gates, fix or revert that batch before continuing. Never accept a screenshot baseline update merely to make the dependency update pass.

## Maintain a small Google Forms package fork

A maintained fork of `react-google-forms-hooks` is the preferred fallback when upstream does not provide a compatible release. Keep the existing Google Forms authoring workflow, public form URLs, MUI renderer and submission API.

1. Fork the upstream source into the maintained GitHub organization, retain its license and attribution, and record the upstream revision.
2. Verify React 19 package imports, server rendering and hydration, plus the actual parsing and submission paths used by this repo. Test the fork's exported hooks too before advertising package-wide React 19 support.
3. Update React peer metadata only for versions covered by tests. Add Vitest checks and CI; make only necessary build, dependency and runtime compatibility fixes. Keep unrelated improvements out of the initial compatibility release.
4. Publish a tagged, built package under a controlled npm scope, then consume that version here. Use an npm alias if preserving existing import paths is desirable. Choose the actual organization and available package name at implementation time; none is assumed reserved.
5. Run the three-site visual and behavior matrix against the published candidate. Track upstream changes and keep a short changelog for ongoing maintenance.

The first release must preserve existing form appearance and payload mapping. Track the existing opaque-response/success-reporting behavior separately and cover it with tests before changing its semantics. This plan does not require an official Forms API integration or an Apps Script deployment.

## Vitest migration and Google Forms checks

Use Vitest 5.0.5 with Vite 8.3.5 on the pinned Node 24 runtime. Vitest requires an explicit Vite dependency under Yarn. Vite serves the test runner only; the Next application can keep Webpack. See the [Vitest requirements and migration notes](https://vitest.dev/guide/migration/).

- Replace `jest.config.js` with an ESM Vitest configuration. Reproduce the TypeScript path aliases, Node test environment, setup files, timeouts and test exclusions. Explicitly limit test discovery to repository source tests, excluding build output and dependencies.
- Port the four existing test files using explicit Vitest imports, and migrate any mocks/timers to their Vitest equivalents. Preserve assertion counts and behavior. Use `vitest run` for CI and a separate watch command locally.
- Replace `jest.setup.ts` with test setup that deliberately loads test environment values. Remove the unconditional global node-fetch override where Node 24 native fetch suffices. Mock CMS and Google requests in deterministic tests.
- Remove direct `jest`, `ts-jest` and `@types/jest` dependencies after the migrated suite passes. Keep `tsc --noEmit` under TypeScript 7 as an independent required check: passing Vitest runtime tests does not prove type correctness.
- Test Google Forms request construction with captured fixtures and mocked transport. Preserve repeated multiselect entries, date serialization, required-field errors, hidden fields and existing layout in both React 19 component tests and the browser matrix.
- The current submission helper uses `no-cors` and checks response status, while the UI sets its success state even when the helper returns false. Track and test this existing behavior explicitly. An opaque response or a mocked successful request does not establish that Google accepted a real submission. Validate any real delivery only against a designated test form, without sending production enquiries.

## Visual and behavior matrix

Use planet.training, upskill.study and baliinternships.com as separate environment configurations. Build each in isolation: `NEXT_PUBLIC_*` values are baked into client bundles, so restarting an already-built server with different tokens is insufficient. Isolate build output, ports and caches to prevent content crossing between sites. Retain the full site configuration, including root directory, locale and theme, as well as the Storyblok tokens.

For deterministic before/after checks, use the same published content snapshot and asset versions on both builds. Maintain an additional draft/editor smoke check. Store test credentials outside tracked fixtures. Live-site comparisons are a supplementary check because live content can change during the upgrade.

| Coverage | Required states |
| --- | --- |
| All three sites | Homepage, representative listing/category, detail/content page, form page, navigation and footer |
| Bali route matrix | `/home`, `/traineeship-bali-indonesia`, `/architecture-internship`, `/internship-in-an-architecture-studio-bali`, `/volunteer-nature-and-wildlife-conservation`, `/turtle-conservation-volunteer-bali-indonesia`, `/sports-and-environment-summer-school`, `/how-to-apply`, `/fees`, `/info/faq`, `/blog-articles`, `/interview-with-patrick-more-than-volunteering-community-conservation-and-purpose-in-bali`, `/meeting` |
| Planet and Upskill route selection | Discover equivalent paths through their actual menus; include site-specific sections, typography and form variants before changing runtime packages |
| Component fixtures | Nested grids, responsive column sizes/offsets, reverse order, background images, long text, buttons, icons, cards, accordions, tabs, menus, drawers, dialogs, timelines and date fields |
| Form interaction | Empty, populated, focused, disabled, required/invalid, helper text, select/multiselect open, calendar open, keyboard date entry, locale/date formatting, reset, loading, success and failure |
| Integration behavior | Mock submission endpoints; assert field names, dates, booleans and hidden fields in payloads. Exercise real third-party rendering separately without submitting production forms |
| Responsive sizes | 390 × 844 mobile, 768 × 1024 tablet and 1440 × 1000 desktop; add tests around configured breakpoints |
| Browser engines | Chromium visual baseline; WebKit and Firefox baseline/smoke coverage for navigation, forms and core layouts; compare each engine against its own baseline |

Wait for fonts, visible images and deterministic application readiness. Scroll through lazy-loaded content before capture. Freeze time, locale, timezone and animation/carousel state. Mock third-party embeds for deterministic screenshots and separately verify live widgets load. Any masked region must be named and justified; do not mask first-party layouts or broadly raise pixel tolerances. Require zero unexplained visual changes; distinguish anti-aliasing from altered geometry, text wrapping, colors or assets.

## Completion and release gates

- A clean immutable install succeeds on the pinned runtime and package manager, with no unexplained peer conflicts.
- React and React DOM are on the tested 19.x target; TypeScript is on 7.x; direct Jest/ts-jest dependencies are removed; GraphQL remains on 16.x.
- Lint, independent TypeScript 7 type checking and deterministic Vitest tests pass. Production builds and servers start for all three site configurations.
- Storybook builds successfully and Chromatic preserves the reviewed baseline; production navigation and form tests pass at the matrix sizes.
- No unexplained first-party screenshot differences, broken images, new hydration errors or new browser runtime errors remain. Known missing icons seen on both live/local Bali are tracked separately from upgrade regressions.
- The package audit records the final installed version for every retained dependency, the reason for every hold/replacement and a revisit condition. GraphQL 16, Node-aligned types and MUI Lab are explicit exceptions. The Google Forms fork must have tested React 19 peer metadata and a pinned release; do not use a blanket peer override. Confirm that most retained registry dependencies are actually on their current latest release.
- Consumer builds use the packed candidate package, not only this repository's development aliases. Peer ranges and release notes reflect tested compatibility.
- Required CI/visual-review checks are enforced before merging; deploy a candidate only after those gates pass. Retain the previous package/lockfile and deployment for rollback.

The first implementation milestone is a green, reproducible test baseline. The final milestone is the current dependency stack, including MUI, passing that unchanged visual contract across all three websites.
