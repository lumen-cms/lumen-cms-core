# Oxc linting and formatting

The root package uses Oxlint 1.90.0, oxlint-tsgolint 7.0.2005 (TypeScript
7.0.2), and Oxfmt 0.75.0. Run `pnpm lint` to check code and formatting,
`pnpm lint:code` for linting alone, and `pnpm format:fix` to format source.
`pnpm lint:fix` applies safe lint fixes followed by formatting.

## Lint policy

`.oxlintrc.json` explicitly enables the migrated Next.js, React, hooks,
accessibility, and import rules. The default correctness category is disabled
because the migrated rules and their severities are selected explicitly; this
does not disable the explicitly configured React Compiler or type-aware rules.

Type-aware analysis is enabled in the config, including promise handling,
unsafe operations, unnecessary assertions, unbound methods, and deprecations.
These newly adopted checks start as warnings so the existing backlog remains
visible without blocking publishing. Use `pnpm lint:code --deny-warnings` to
enforce all warnings while cleaning up the backlog. The independent
`pnpm check-types` command remains the build's TypeScript check.

React Compiler lint diagnostics are enabled, including the recommended checks
and `void-use-memo`. This does not enable automatic memoization in Next.js.
The existing warning policy for `static-components`, `set-state-in-effect`,
`immutability`, and `refs` is preserved. Two date-rendering components have a
scoped `purity` warning override pending behavior review. Test probes publish
hook results after commit; the temporary test-only `globals` warning override
has been removed. Other compiler errors remain blocking.

One Next.js rule, `no-location-assign-relative-destination`, is not implemented
natively in this Oxlint release. It runs through `@next/eslint-plugin-next`
under the `next-fallback` alias. Remove that dependency and alias when the rule
is available natively. `react/no-deprecated` is replaced by the broader
type-aware `typescript/no-deprecated` warning. JSX usage marker rules are not
needed; React Compiler `config` and `gating` have no equivalents because
Oxlint uses fixed compiler options and does not expose gating configuration.

Existing ESLint disable comments are respected, and unused directives are
reported. Review broad disable comments before removing them: they can also
suppress newly enabled rules.

## Formatting and scope

`.oxfmtrc.json` preserves 80-column width, no semicolons, single quotes, and
no trailing commas. Import and package.json sorting are disabled. The initial
formatting changes reflect Oxfmt's modern Prettier-compatible layout rules.

Linting targets `src`; formatting targets its TS/TSX files. Both retain the
previous generated-code and Storybook helper exclusions. Update ignore patterns
in both configs together. The old formatter wrapper is removed, so formatting
no longer runs a second lint pass. The separate legacy `base/` package is not
part of this migration.

For editor integration, use the Oxc extension (`oxc.oxc-vscode`) and select
Oxfmt as the formatter for this workspace. Type-aware CLI behavior is configured
in `.oxlintrc.json`; editor type-aware analysis may additionally need the
extension's `typeAware` option.

## Migration validation (2026-10-30)

- `pnpm lint`: passed, with 949 warnings and no errors. The expanded type-aware
  checks account for most warnings; this is a migration baseline, not a clean
  strict-lint result.
- Oxfmt: 577 source files checked; 24 files received formatting changes.
- `pnpm check-types`: passed.
- `pnpm test`: 466 tests passed across 111 files.

The migration does not certify application builds, integration tests, or visual
behavior. Source edits in this change are formatter output only.

## First warning cleanup (2026-10-30)

Warnings decreased from 949 to 674 (275 removed), without disabling rules or
adding suppression comments. Type-safety warnings decreased by 270; five React
Compiler findings were resolved.

- Removed redundant assertions and the type imports they left unused. Retained
  assertions that Oxlint considers redundant but the project's TypeScript check
  still requires.
- Typed calendar locale modules and toolbar generics. Replaced the calendar
  event's `any` resource inherited from the upstream `Event` type with the
  existing CMS event type using `Omit`.
- Narrowed the static SEO fixtures instead of accessing them through `any`,
  typed regex replacement captures, and made infinite-scroll results generic.
- Published test probe values in layout effects and derived dialog transition
  props without mutating the caller's object. A regression test checks frozen
  input props, transition selection, and preservation of dialog options.

`pnpm lint`, `pnpm check-types`, and all 467 unit tests (112 files) pass.
Effect-timing, clock-dependent rendering, and remaining shared-object mutations
need targeted behavioral review; they have not been rewritten just to silence
compiler diagnostics. Integration tests and application builds were not run for
this cleanup batch.

## Second type-safety cleanup (2026-10-30)

Warnings decreased from 674 to 478 (196 type-safety findings removed), with
409 type-safety warnings remaining. Rule severities and suppressions are
unchanged.

- Typed preview-bridge event mocks and component prop captures for tabs,
  avatars, dividers, list results, forms, toolbar, Swiper, core rendering, and
  travel registration. Sparse CMS fixtures remain explicitly identified as
  partial test inputs rather than being propagated through `any`.
- Gave the rich-text corpus and baseline files explicit test-data shapes.
- Made the legacy story filter generic over the fields it actually reads,
  preserving the original story type in its return value without requiring
  unrelated CMS fields in fixtures. Filtering, sorting, limiting, and object
  identity are unchanged.
- Typed the local Storyblok category filter construction, removing five
  `@ts-ignore` comments. Preserved FastSpring product types through its data
  callback and used Auth0's redirect-state type. The existing unawaited locale
  navigation is explicitly marked with `void`; rejection handling is unchanged.

`pnpm lint`, `pnpm check-types`, and all 467 unit tests (112 files) pass. The
rich-text corpus integration check was type-checked but not executed; it needs
external corpus/baseline files. Application builds and integration tests were
not run for this batch.

## Third type-safety cleanup (2026-10-30)

Warnings decreased from 478 to 380 (98 type-safety findings removed), leaving
311 type-safety warnings. No rule severities or suppressions were changed.

- Typed rich-text mark attributes, container props, and the document boundary
  while preserving the existing document checks and rendering operations.
- Typed the registered link renderer and corrected `LinkHandlerProps.component`
  from an instantiated React element to a component type. Slider children now
  use the existing CMS block and section types.
- Replaced untyped mocks for dialogs, player, carousel controls, Shopify
  carousel, auth visibility, and transport responses with explicit contracts.
- Typed enriched-page integration assertions, preserved the input type in the
  synthetic story factory, and kept typed widget references across SSR loading
  to verify in-place enrichment without `any`.

TypeScript and all 467 unit tests (112 files) pass. Lint reports no errors;
formatting is checked separately after the formatter's second pass on the
transport mock declaration. Integration tests and application builds were not
run. The dynamic core renderer remains a follow-up: tightening its input
contract exposed an existing potentially missing checkout integration, whose
runtime handling needs a separate behavioral decision.


## Fourth type-safety cleanup (2026-10-30)

Warnings decreased from 380 to 334 (46 type-safety findings removed), leaving
265 type-safety warnings and 69 other warnings. Rule severities and suppressions
are unchanged.

- Typed travel-search query keys, JSON response data, and the SWR error boundary.
  URL parameter string conversion and request failure behavior are preserved.
- Replaced untyped captures in image, image-list, card, section, Google Form,
  form-builder, category checkbox, snackbar, SEO, and travel tests with concrete
  prop contracts or unknown values. Request-body assertions narrow the Shopify
  fetch mock before parsing JSON.
- Used async React `act` callbacks for travel context and search tests so awaited
  updates follow the asynchronous overload.

`pnpm lint`, `pnpm check-types`, and all 467 unit tests (112 files) pass.
Integration tests and application builds were not run. Remaining dynamic CMS
and third-party boundaries need further contract review; React compiler
warnings were left unchanged in this batch.


## Fifth type-safety cleanup (2026-10-30)

Warnings decreased from 334 to 279 (55 type-safety findings removed), leaving
210 type-safety warnings and 69 other warnings. No lint rule severities or
suppressions were added or weakened.

- Typed the application provider registry using its existing children/settings
  contract, preserving provider registration, ordering, and rendering.
- Typed travel context keys and job-search fields without changing truthiness,
  deletion, filtering, or scroll behavior; removed six `@ts-ignore` comments.
- Declared the jobs-feed response shape and the existing why-did-you-render
  module contract. The generic fetch helper now defaults to `unknown`, requiring
  callers to supply a result type or narrow it; JSON parsing and error behavior
  are unchanged. Response assertions describe expected data, not validation.
- Replaced unsafe test captures and fixture boundaries for image-list items,
  drawer content, head scripts, snackbar actions, locale redirects, Google Forms
  requests, Markdown/page-data snapshots, and state providers. Kept existing
  assertions and fixture payloads intact.

`pnpm lint`, `pnpm check-types`, and all 467 unit tests (112 files) pass.
Integration tests and application builds were not run. The 19 React compiler
warnings remain unchanged; this batch focused on types and test contracts.


## Sixth type-safety cleanup (2026-10-30)

Warnings decreased from 279 to 247 (32 type-safety findings removed), leaving
178 type-safety warnings and 69 other warnings. No rules were weakened or new
suppressions added.

- Typed the recursive CMS enrichment blocks and loader results, preserving
  concurrent loading, traversal, and in-place assignment of loaded data.
- Typed Auth0 and Google Forms submission values and button/link presentation
  props. Form encoding, honeypot handling, and click behavior are unchanged.
- Added concrete DOM ref types for the timeline's always-rendered spans,
  preserving observer registration and completion callbacks.
- Made cache storage unknown, reads generic with an unknown default, and writes
  preserve the supplied value's type. Cache identity and missing-key behavior
  are unchanged; generic reads are caller-provided contracts, not validation.
- Typed list-widget filter construction and removed its `@ts-ignore` comment.

`pnpm lint`, `pnpm check-types`, and all 467 unit tests (112 files) pass.
Integration tests and application builds were not run. React compiler warnings
remain unchanged in this batch.


## Seventh type-safety cleanup (2026-10-30)

Warnings decreased from 247 to 203: 40 type-safety findings and four obsolete
suppression directives removed. There are 138 type-safety warnings and 65 other
warnings remaining. No rules were weakened or suppressions added.

- Typed preview cookies against the installed Next.js helpers' array output,
  verified in their implementation. Cookie rewriting and redirects are unchanged.
- Typed landing-page, Shopify, Google Form, and list-widget Storybook loader
  boundaries and props, preserving sparse fixtures and settings override order.
  These boundary assertions describe expected loader data, not validation.
- Typed the CMS pagination fixture and used property-path assertions for nested
  resolved relations, checking the same expected values without unsafe access.
- Removed redundant Shopify configuration/variant assertions while retaining
  the existing handling of a potentially absent configuration.

`pnpm lint`, `pnpm check-types`, and all 467 unit tests (112 files) pass.
Integration tests, Storybook builds, and application builds were not run.
React compiler warnings remain unchanged in this batch.


## Eighth type-safety cleanup (2026-10-30)

Warnings decreased from 203 to 175 (28 type-safety findings removed), leaving
110 type-safety warnings and 65 other warnings. No rules were weakened or new
suppressions added.

- Used existing CMS types for main/right-drawer/static content and category tag
  references, preserving category selection and filtering semantics.
- Typed the image-click identifier, slider option literals, tab value, and
  Shopify product context. Rendering and event behavior are unchanged.
- Made form/video errors and form response JSON unknown, typed the Google Forms
  embedded-data boundary, and described the CORS middleware and base-page props.
- Marked speech-store methods as independent of `this`, preserving their stable
  identities. Existing unawaited auth/navigation calls now use `void`, without
  changing rejection handling or scheduling.
- Retained the news mock directly instead of extracting a service instance
  method for test setup and assertions.

`pnpm lint`, `pnpm check-types`, and all 467 unit tests (112 files) pass.
Integration tests and application builds were not run. React compiler warnings
remain unchanged in this batch.


## Ninth type-safety cleanup (2026-10-30)

Warnings decreased from 175 to 150 (25 type-safety findings removed), leaving
85 type-safety warnings and 65 other warnings. No rules were weakened or new
suppressions added.

- Declared the Auth0 language claim and the existing string/object role-claim
  formats. Four tests cover requested-role precedence, configured object fields,
  absent/empty claims, the any-role shortcut, and existing string-key indexing.
  Return values and authorization decisions are unchanged.
- Typed the Instagram search response fields being read. Its ID and generic
  list response now default to unknown where their full shape is unspecified;
  fetch behavior, optional accesses, and errors are unchanged. Assertions at
  these external boundaries describe expected data, not runtime validation.
- Used Deepdash's published function type and typed the parent fields read by
  the drawer traversal callback, retaining its original callback position and
  traversal behavior.
- Replaced the grid breakpoint indexing suppression with an explicit typed
  access, preserving the legacy accepted input types, and prevented Vitest's
  asymmetric matcher return types from propagating any into nested expectations.

`pnpm lint`, `pnpm check-types`, and all 471 unit tests (113 files) pass.
Integration tests and application builds were not run. React compiler warnings
remain unchanged in this batch.


## Tenth type-safety cleanup (2026-10-30)

Warnings decreased from 150 to 133 (17 type-safety findings removed), leaving
68 type-safety warnings and 65 other warnings. No rules were weakened or new
suppressions added. This batch changes types and declarations only.

- Typed SWR errors as unknown for list stories and the search palette.
- Declared the FastSpring builder calls used by checkout and its discount field.
  Checkout calls, payloads, and existing trigger mutations are unchanged.
- Typed link/image events without changing event target access, spread order,
  async behavior, or lightbox selection. Retained unknown values during nested
  palette access, preserving optional indexing and primitive property access.
- Described the request-body and sitemap domain-map JSON boundaries without
  changing parsing, truthiness checks, spreading, or response behavior.
- Added a local cssnano-simple declaration checked against the installed 3.0.2
  implementation, removing the import suppression while retaining the same
  plugins, options, and PostCSS processor behavior.

`pnpm lint`, `pnpm check-types`, and all 471 unit tests (113 files) pass.
Integration tests and application builds were not run. Assertions describe
existing boundary contracts, not added validation. React compiler warnings
remain unchanged in this batch.


## Eleventh cleanup (2026-10-30)

Warnings decreased from 133 to 80: ten type-safety findings and 43 unused
suppression directives removed. Remaining: 58 TypeScript warnings, 19 React
compiler warnings, and three Next.js warnings. No rules were weakened.

- Made `getAll` generic over story content with an unknown default and a typed
  REST story envelope. Page-list, news, category, event, and legacy widget callers
  now supply their content contracts. Replaced GraphQL PageItem annotations in
  REST page-list consumers with the actual REST page-story type.
- Preserved every request, cache key, clone, pagination calculation, and return
  value. Generic content types describe expected payloads, not new validation.
- Typed grid prop distribution and its test capture while preserving breakpoint
  detection, forwarded props, and nested spacing/overflow behavior.
- Removed an unnecessary iframe registration cast and obsolete lint comments
  reported by the active linter. Existing runtime operations remain unchanged.

`pnpm lint`, `pnpm check-types`, and the current workspace's 486 unit tests
(114 files) pass. Integration tests and application builds were not run.
React compiler warnings remain unchanged.


## Twelfth type-safety cleanup (2026-10-30)

Warnings decreased from 80 to 69 (11 type-safety findings removed), leaving
47 TypeScript warnings, 19 React compiler warnings, and three Next.js warnings.
No rules were weakened or suppressions added.

- Typed drawer dispatch and flattened navigation blocks with the existing CMS
  unions, including toolbar search. Corrected the navigation-list input from
  NavMenuStoryblok to NavListStoryblok and described the optional presentation
  fields read by legacy drawer buttons. Rendering branches, property access,
  menu expansion, filtering, and child order are unchanged.
- Made query serialization accept unknown values and retain unknown through
  property lookup. Native URI coercion remains intact rather than introducing
  string conversion, validation, or filtering. Four regression tests cover
  nested arrays, escaping/order, empty values, primitive inputs, inherited
  properties, null-prototype objects, bigint, and symbol failures.

`pnpm lint`, `pnpm check-types`, and all 490 unit tests (115 files) pass.
Integration tests and application builds were not run. React compiler warnings
remain unchanged in this batch.


## Thirteenth type-safety cleanup (2026-10-30)

Removed all 13 type-safety warnings from the core component renderer. The latest
workspace lint run reports 57 warnings: 34 TypeScript, 19 React compiler, three
Next.js, and one exhaustive-deps warning in concurrently edited parallax code.
No rules were weakened or suppressions added.

- Defined the renderer's required CMS content contract with its component name,
  optional identifier/editor marker, and unknown extension fields. Typed the
  dynamic registration lookup as a React element type.
- Made checkout's existing required-integration assumption explicit without
  adding fallback behavior. Missing integration still fails as before; this
  cleanup does not fix or conceal that runtime limitation.
- Added regression tests for missing renderer content and missing checkout
  integration. Existing tests continue checking consumer overrides, forwarded
  props, unknown component output, lazy registrations, and preview markers.

TypeScript, lint-code, and all four renderer tests pass. The latest full unit
run has 491 passing tests and one failure in SectionParallax.test.tsx because
its mock lacks useParallaxController. Formatting flags DeferredParallaxLayer.tsx.
Those files are being edited outside this cleanup batch and were left intact.
Integration tests and application builds were not run.


## Fourteenth cleanup (2026-10-30)

The current workspace reports 47 warnings, down from the previous observed 57:
25 TypeScript, 19 React compiler, and three Next.js warnings. Concurrent workspace
changes added six test-type warnings during this batch; those were also fixed.
No rules were weakened or suppressions added.

- Typed menu link props and the legacy label rendering boundary, retained the
  ignored feed-locale input as unknown, and typed travel sitemap passthrough
  data without converting its timestamp.
- Removed a redundant Shopify story cast and gave travel mock state explicit
  annotations instead of assertions.
- Replaced deprecated trimLeft/trimRight calls with their standard aliases
  trimStart/trimEnd, preserving tokenizer whitespace semantics. The existing
  Markdown fixture suite passes.
- Typed the newly added Swiper test capture using SwiperOptions and narrowed
  its expected navigation/pagination objects before checking them. Prevented
  a parallax asymmetric matcher from propagating any into its expectation.

TypeScript and lint/format checks pass. The latest full unit suite passes all
502 tests in 117 files. The prior parallax test failure is resolved in the
current workspace. Integration tests and application builds were not run.

## Fifteenth cleanup (2026-10-30)

The current workspace reports 41 warnings, down from 47: 19 TypeScript,
19 React compiler, and three Next.js warnings. No rules were weakened or
suppressions added.

- Mapped Shopify's documented URL scalar to string in the checked-in schema
  and operation types, and recorded the mapping in the archived codegen recipe.
  No remote schema generation was run. Checkout's context return type now
  reflects its existing URL-or-undefined result. Missing image and checkout
  values retain their existing runtime behavior.
- Bound the native own-property check used by query serialization, preserving
  its receiver and coercion behavior; existing regression tests pass.
- Replaced deprecated description substr usage with slice and a nonnegative
  length clamp. Fourteen regression cases cover zero, negative and fractional
  limits, string limits, nonfinite values, and UTF-16 truncation.

TypeScript and lint/format checks pass. The full unit suite passes all 516 tests
in 118 files. A transient type-check failure from concurrent dependency edits
was resolved in the current workspace. Integration tests and application builds
were not run.

## Sixteenth cleanup (2026-10-30)

The current workspace reports 36 warnings, down from 41: 14 TypeScript,
19 React compiler, and three Next.js warnings. No rules were weakened or
suppressions added.

- Corrected Shopify add-to-cart and FastSpring popup callback declarations to
  allow their existing synchronous or promise-returning implementations. The
  add-to-cart caller explicitly discards the return value as before; callback
  timing and rejection handling are unchanged.
- Replaced the serializer's unbound native method reference with an explicit
  receiver call. Existing coercion and inherited-property regression tests pass.
- Migrated internal Next image priority props to preload while retaining the
  public square-image priority option for compatibility. CMS priority values
  still control the same loading behavior. Three tests compare actual rendered
  image markup and preload hints for true, false, and absent values.

TypeScript and lint/format checks pass. All 519 unit tests in 119 files pass.
Integration tests and application builds were not run.

## Seventeenth cleanup (2026-10-30)

Removed three TypeScript warnings by typing form submission data as
Record<string, unknown> at both the FormContainer generic and the public
onSubmit callback. This replaces an any boundary without changing submission
values, payload filtering, callbacks, or the existing Storybook action calls.
No rules were weakened or suppressions added.

The current workspace reports 34 warnings: 11 TypeScript, 19 React compiler,
and four Next.js warnings. Concurrent changes added a no-img-element warning
in SectionParallax.test.tsx, so the net count moved from 36 to 34.

TypeScript and lint/format checks pass. All 520 unit tests in 119 files pass,
including the existing form payload-precedence and callback-data regression.
Integration tests and application builds were not run.

## Eighteenth cleanup (2026-10-30)

The current workspace reports 31 warnings, down from 34: eight TypeScript,
19 React compiler, and four Next.js warnings. No rules were weakened or
suppressions added.

- Made link event handlers explicitly discard the existing async scroll
  operation's promise. The operation remains async so DOM failures still
  reject; scrolling and preventDefault still execute synchronously. Six
  regression cases cover normal scrolling, fragment parsing, missing anchors,
  drawer navigation, and rejection behavior.
- Made the Auth0 redirect callback explicitly discard Router.replace's return
  value. The installed Auth0 provider invokes the callback without awaiting or
  using its result. Routing arguments, synchronous exceptions, and rejected
  navigation promises retain their existing behavior.

TypeScript and lint/format checks pass. All 526 unit tests in 120 files pass.
Integration tests and application builds were not run.

## Nineteenth cleanup (2026-10-30)

The scraper result is now explicitly unknown, including the public async
return type, removing unsafe assignment and return warnings without changing
values or adding validation. Four regression cases verify result identity,
synchronous and promise returns, and synchronous and asynchronous failures.
The unresolved instagram-scraping dependency still produces call/member warnings;
no declaration, dependency, suppression, or rule change was added to hide them.

The latest full lint run reports 30 warnings: seven TypeScript, 19 React compiler,
and four Next.js warnings. This batch removed two warnings; concurrent schema
work added a StoryblokRichtext deprecation warning.

All targeted Instagram tests and formatting checks pass. The full unit run
has 524 passing and six failing tests, with failures in DeferredSwiper.test.tsx
and LmSwiper.config.test.tsx during concurrent slider edits. The full type check
reports schema-related errors outside this batch, and the full formatting check
flags nine other files. Those concurrent changes were left intact. Integration
tests and application builds were not run.

## Twentieth cleanup (2026-10-30)

Typed Auth0 custom claims using a shared AuthUser contract with optional id
and lang, and allowed the existing missing-id case in the user store. No claim
values are converted or defaulted. Made the search-palette fixture server
explicitly discard its async handler result, preserving response paths and
existing error handling.

These changes remove two TypeScript warnings. The latest lint run has four
TypeScript warnings remaining: deprecated WebkitBoxOrient and frameBorder,
and two unresolved instagram-scraping call/member warnings. The concurrent
Storyblok deprecated-export warning is also gone.

Type checking and formatting of changed files pass. Both search-palette
integration tests pass after running with local server access. The full unit
run has 532 passing tests and one failure in storyblokSchema.test.ts; full
lint reports an unrelated module-variable error in swiperEffects.ts during
concurrent changes. Those edits were left intact. Application builds were
not run.

## Twenty-first cleanup (2026-10-30)

The workspace now reports zero TypeScript lint warnings. The scraper import
has an explicit consumer-side method contract with an unknown result. This is
a type assertion of the existing call requirement, not runtime validation or
an installation of the absent optional dependency; the pre-existing import
limitation remains. A regression test verifies the method receiver is retained.

Two line-scoped typescript/no-deprecated exceptions intentionally retain
WebkitBoxOrient and frameBorder. These are compatibility exceptions, not API
migrations: replacing them could change line-clamp support or border cascade
behavior. Comments explain both exceptions, and rendering tests verify the
existing inline clamp styles and iframe attributes before and after hydration.
No global rules were weakened.

Type checking and all 536 unit tests in 123 files pass. The lint-code run has
23 non-TypeScript warnings (19 React compiler and four Next.js). Formatting
drift in four concurrently edited files was normalized without logic changes.
Integration tests and application builds were not rerun in this batch.

## Twenty-second cleanup (2026-10-30)

The current workspace reports 21 warnings, down from 23: 17 React compiler
and four Next.js warnings, with no TypeScript lint warnings.

DateHeadline now reads the current year through useSyncExternalStore with a
stable numeric snapshot and an inert subscription. It adds no timer: subsequent
renders sample the clock as before. Server output and first-placeholder-only
replacement are preserved, and two regression tests cover missing text and a
year rollover. Both text variants share one year snapshot. Removed this file's
purity-rule downgrade so the normal error-level rule applies. No suppressions
were added.

Lint/format and all 537 unit tests in 123 files pass. The full type check is
blocked by concurrent component-registry typing errors in BaseComponents,
NamedComponentsAdditional, and related files; those edits were left intact.
Integration tests and application builds were not run.

## Twenty-third cleanup (2026-10-30)

Replaced pagination effect bookkeeping in useInfiniteScroll and CardList with
conditional state reconciliation against the previous visibility/pagination
inputs. This removes two React compiler warnings and the intermediate stale-page
commit while retaining pagination results and accumulated page counts. No rules
were weakened and no suppressions added.

Regression tests cover repeated visibility values, exit/re-entry, collection
shrink/restore, page-size changes, pagination toggles, and Strict Mode. Re-enabling
pagination while visible still advances a page, and collection changes do not
reset the accumulated count.

Type checking, lint/format, and all 547 unit tests in 125 files pass. React
compiler warnings decreased from 17 to 15; four Next.js warnings remain.
Concurrent changes introduced seven TypeScript warnings outside this batch,
so the current total is 26. Integration tests and application builds were not run.

## Twenty-fourth cleanup (2026-10-30)

The current workspace reports 19 warnings: 15 React compiler and four Next.js,
with zero TypeScript lint warnings. Removed four redundant assertions from
travel section content and the Shopify checkout story. Made three async click
handlers explicitly discard their promise at the React event boundary, leaving
their async operations, loading state, retry behavior, and error handling intact.

Concurrent Swiper edits introduced two additional type warnings during this
batch. Typed the native prototype result as unknown and removed an unnecessary
active-index assertion; both are erased at runtime. No rules were weakened and
no suppressions added.

Type checking, lint/format, and all 547 unit tests in 125 files pass, including
account-change and cart/product checkout-retry coverage. Integration tests and
application builds were not run.

## Twenty-fifth cleanup (2026-10-30)

The workspace reports 17 warnings, down from 19: 13 React compiler and four
Next.js warnings, with zero TypeScript lint warnings.

Reconciled menu anchors on slug changes and latched the drawer's opened-once
state through conditional state updates instead of post-commit bookkeeping
effects. This removes intermediate stale state. Deferred menu opening and its
timer cleanup remain in the existing effect, as does the drawer's route and
breakpoint close effect. No rules were weakened and no suppressions added.

Regression coverage verifies same-route menu persistence, route-change closing,
reopening, timer cleanup, drawer open/close retention, and persistent versus
temporary/mobile drawer close behavior in Strict Mode.

Type checking, lint/format, and all 554 unit tests in 127 files pass.
Integration tests and application builds were not run.

## Twenty-sixth cleanup (2026-10-30)

The workspace reports 14 warnings, down from 17: ten React compiler and four
Next.js warnings, with zero TypeScript lint warnings.

Reconciled Shopify cart cleanup on open-to-closed transitions, retaining the
quantity > 0 filter. Zero-quantity entries remain while open; quantity edits
while already closed do not trigger early cleanup. Reconciled story-list page
resets when nonempty search text/category inputs change. Clearing either input
still retains the current page. Both changes remove post-commit bookkeeping
updates without changing the tested resulting state. No rules were weakened
and no suppressions added.

Regression tests cover cart open/close cleanup, positive quantities, closed-cart
edits, and entering versus clearing search filters. Type checking, lint/format,
and all 555 unit tests in 127 files pass. Formatting drift in the concurrently
edited schema test was normalized without logic changes. Integration tests and
application builds were not run.

## Final compatibility pass (2026-10-30)

The full lint command now reports zero warnings/errors. This final pass does
not claim that all legacy components are compiler-compatible: it documents
explicit exceptions for behavior that cannot be removed without observable
changes. Global lint rules remain enabled, and the prior file-wide countdown
purity downgrade was removed in favor of a single-line exception.

Five components explicitly opt out of compiler memoization with `use no memo`:

- LmFastSpringCheckout mutates the caller's trigger and consumes one occurrence
  of each price placeholder per render. Two line-scoped immutability exceptions
  cover the existing access/write; the caller's identity and repeated-render
  behavior remain intact.
- GlobalTheme writes a missing default font into shared settings.
- Layout migrates legacy tawkto configuration into shared chat-button settings
  before children render. Both settings writers have local immutability exceptions.
- HeadlineCountDown samples its fallback date when countdown_time changes, using
  the existing memoization boundary. Its clock read has a local purity exception.
- ListStories reads a nonreactive pagination marker during rendering. Its local
  refs exception preserves same-page navigation and revalidation behavior.

Additional line-scoped compatibility exceptions preserve Motion's post-commit
initial transition, SectionVideoBg's committed-DOM measurement timing, and the
FastSpring full-document purchase refresh. Three raw-image warnings are scoped
to image mocks in tests; production image rules remain enabled. These exceptions
are deliberate retained behavior, not fixes to the underlying legacy patterns.

New regression tests cover caller-visible FastSpring mutation/identity,
countdown fallback sampling and UTC parsing, and immediate/delayed animation
commits, cancellation, and cleanup. Type checking, lint/format, and all 560 unit
tests in 130 files pass. git diff --check passes after normalizing a trailing
blank line in the concurrently edited README. Integration tests and application
builds were not rerun in this pass.

## Approved settings cleanup (2026-10-31)

Removed the obsolete Layout migration from settings.tawkto to chat_button.
The legacy field is now ignored by Layout; explicitly configured chat buttons
continue rendering unchanged. The explicit chat_tawkto component remains
available; this change removes only the obsolete settings migration.

GlobalTheme now uses the Nunito fallback locally when theme_font_default is
missing or empty. Environment font overrides retain priority. Settings are no
longer mutated. Removed the compiler opt-outs and local immutability exceptions
from both Layout and GlobalTheme. FastSpring's replacement behavior and its
compatibility treatment remain unchanged at the user's request.

Seven new cases verify missing/empty/configured/environment fonts using frozen
settings and removal of the legacy chat migration. Type checking and lint/format
pass with zero warnings; all 567 unit tests in 132 files pass, including the
existing FastSpring mutation regression. Integration tests and application
builds were not run.

## Immutable FastSpring trigger rendering (2026-10-31)

At the user's request, FastSpring now resolves label, text, and text_xs into a
shallow copy of the supplied trigger using replaceAll for price, total, and
discount placeholders. Every occurrence is replaced, and subsequent product
updates use the original template rather than previously substituted values.
The caller's trigger is no longer mutated. These display/mutation changes are
intentional and supersede the earlier compatibility requirement.

The checkout click handler is unchanged. Removed this component's use no memo
directive and both local immutability exceptions. Tests verify frozen input,
repeated placeholders across all three fields, current prices, empty-price
fallbacks, redirect handling, analytics payloads, product/user payloads, checkout
call ordering, and the text_only guard.

Type checking and lint/format pass with zero warnings. All 569 unit tests in
132 files pass. Integration tests and application builds were not run.

## Remaining compiler opt-outs removed (2026-10-31)

Removed the final two use no memo directives and four local exceptions:

- HeadlineCountDown owns its sampled deadline in lazily initialized state,
  reconciling countdown_time changes without resampling on unrelated renders.
- ListStories uses state for its rendered initialization flag and retains the
  event ref for route callbacks. Selecting the current page still makes no
  extra request or scroll; regression tests exercise that path.
- SectionVideoBg measures the actual committed container through a DOM ref,
  retaining the visibility, URL, ratio-mode and entry dependency boundaries.
  The composed ref forwards the intersection observer's cleanup function.
- FastSpring's authenticated purchase refresh resolves /refetch against
  document.baseURI before assigning location.href. It retains full-document
  navigation, while guest checkout continues using Router.push. Tests cover
  both normal and alternate document bases, redirect reset and call ordering.

No compiler opt-outs remain. Six explicit exceptions remain: Motion's hidden
initial commit before its immediate animation, two deprecated browser
compatibility properties, and three raw-image test mocks. These were retained
rather than changing timing/CSS behavior or disguising the same exception.

Type checking and lint/format pass with zero warnings. All 573 unit tests in
134 files pass. Integration tests and application builds were not run.

## Animation lifecycle and image test probes (2026-10-31)

Removed four more local exceptions without adding new suppressions or opt-outs.
Motion now owns animation readiness in a per-instance subscription store exposed
through useSyncExternalStore. Subscription begins after commit, preserving the
hidden first frame. Zero delay adds no timer; delayed starts, cancellation on
visibility/configuration changes, latched readiness, and unmount cleanup retain
their tested behavior. SSR does not subscribe or schedule a timer.

The three image test doubles now expose their incoming props through explicit
DOM probes rather than raw image tags. Assertions still cover styles, loading,
priority, quality, click forwarding, and element identity across updates.
Production image rendering is unchanged.

Only two local deprecation exceptions remain: WebkitBoxOrient for the existing
line-clamp layout and frameBorder for the existing iframe attribute/cascade.
Replacing either is outside strict output/behavior preservation; neither was
hidden behind a wrapper or moved into a broader rule exclusion.

Type checking and lint/format pass with zero lint warnings. All 587 unit tests
in 135 files pass. pnpm reported an aborted dependency-install verification
because of store/lockfile drift during concurrent work; scripts nevertheless
completed successfully against the installed dependencies. No dependency
installation or lockfile change was made by this cleanup. Integration tests and
application builds were not run.

### Headline compatibility CSS and iframe borders (2026-10-31)

Removed the final two local deprecation exceptions. Iframes now use inline
`border: 0` instead of `frameBorder`. This preserves their borderless appearance;
as discussed, ordinary consumer CSS border rules no longer override that default.

Headlines apply a scoped CSS module class for `-webkit-box-orient: vertical`
only when `max_lines` is configured. The prefixed browser compatibility mechanism
is intentionally retained. The line limit, display, overflow, and ellipsis remain
inline to preserve their precedence over typography and advanced theme styles.
Custom rules specifically targeting box orientation can still affect the class
through the CSS cascade; moving to CSS cannot reproduce inline specificity for
every possible consumer stylesheet.

All 587 unit tests in 135 files and type checking pass. An isolated Chromium
comparison produced pixel-identical before/after screenshots for eight headline
cases (two widths, one/three lines, normal/preserved line breaks, with competing
display/overflow styles) and two iframe cases (responsive and nonresponsive).
These are fixture comparisons, not full-site visual tests. Dependency verification
again reported store/lockfile drift; checks ran against installed dependencies.
No dependency or lockfile changes were made for this refactor.

References:

- https://oxc.rs/blog/2026-07-22-type-aware-linting-stable.html
- https://oxc.rs/blog/2026-02-24-oxfmt-beta.html
- https://oxc.rs/blog/2026-08-18-react-compiler-support.html
