# Storyblok tooling audit and upgrade — 27 October 2026

This batch follows the security/tooling update on `feature/mui-v9`. Runtime
integrations now use current stable Storyblok packages. The official CLI now
generates the active component types, with explicit application extensions and
number/string compatibility for existing callers. Screenshots remain deferred at
the user's request. This is not a visual or live-editor release sign-off.

## Package and integration decisions

| Area | Previous implementation | Current decision |
| --- | --- | --- |
| React integration | Deprecated `storyblok-react` 0.1.2 | Replaced with `@storyblok/react` 7.4.0. SDK 8 is an RC and is not selected. |
| React rich text | Third-party `storyblok-rich-text-react-renderer-ts` 3.2.0; peers stop at React 18 | Replaced with the official SDK's `createRichTextRenderer`, backed by `@storyblok/richtext` 5.3.3. |
| HTML/feed rich text | Deprecated `StoryblokClient.richTextResolver` | Uses standalone `@storyblok/richtext` rendering. The service retains its existing `.richTextResolver.render()` facade for callers. |
| Preview bridge | Unversioned CDN script and manually registered listeners | Bundled `@storyblok/preview-bridge` 2.6.1 through the SDK loader; listeners/bridge destroyed on unmount. |
| Content API | `storyblok-js-client` 7.1.5 → 7.8.1 | Fetching now uses `@storyblok/api-client` 0.9.1 through a compatibility adapter. See the [fetching migration](storyblok-fetching-migration.md). |
| CLI | Unspecified global CLI; old `pull-components` / `push-components` commands | Locally pinned `storyblok` 4.25.0, with adapters for the existing snapshot workflow. |
| Component types | `storyblok-generate-ts` 1.x with custom field mappings and application additions | Migrated all 141 components to the official CLI. Removed the third-party generator and its obsolete direct JSON-schema compiler dependency. TypeScript 7 remains the compiler gate. |
| GraphQL tooling | Updated in the preceding batch | GraphQL stays on v16. Codegen/client upgrades from the security batch remain in place. |
| Image service | Custom Next image loader with existing widths/quality | Retained to preserve image URLs and appearance. Official `buildStoryblokImage` is a future alternative, not required for this SDK migration. |
| Material-icons field plugin | Git dependency on the separate custom plugin project | This repository imports only its icon-list JSON for Storybook. Migrating the deployed field plugin to the current Field Plugin SDK belongs in that plugin's own repository. |

References: [Storyblok library index](https://www.storyblok.com/docs/libraries),
[stable React SDK](https://www.storyblok.com/docs/libraries/js/react-sdk),
[rich-text library](https://www.storyblok.com/docs/libraries/js/rich-text),
[CLI commands](https://www.storyblok.com/docs/tooling/cli).

## Runtime compatibility

The official renderer's defaults differ from this repository's old renderer:
bold/italic tags, empty containers, link grouping and previously ignored marks
can change the rendered document. The adapter retains the existing MUI link
resolver, mark nesting, `<b>`/`<i>` tags, empty-container handling and ignored
`textStyle` behavior. Existing embedded rich-text bloks remain disabled, as they
were before. Enabling new rich-text styling/features is a separate change that
needs visual acceptance.

An inventory of the three previously built sites yielded 8,529 distinct
rich-text documents. It includes 5,855 `textStyle` marks that previously had no
effect. The adapter produces **exactly the same server-rendered HTML for all
8,529 documents**. This is markup coverage, not a substitute for browser visual
checks or validation of content types absent from that sample.

The deprecated preview wrapper called `ReactDOM.findDOMNode`, which is absent
in React 19. Its replacement uses the official `storyblokEditable` attributes
and inert template markers to reach the actual component root without an extra
layout wrapper. This compatibility adapter is needed because existing consumer
components do not consistently forward props/refs. It also handles a lazy root
replacing its fallback. Production rendering bypasses the preview adapter.

The provider now uses the bundled bridge, resolves the same links/relations as
the content service, updates matching page/global content on input, and cleans
up on navigation/unmount. Save events requesting a reload and publication
events reload the preview. An authenticated editor session still needs to
confirm selection outlines, input updates, translated pages and publication.

## New API and schema paths

Fetching has now migrated to [`@storyblok/api-client`](https://www.storyblok.com/docs/libraries/js/content-delivery-api-client)
0.9.1. React/rich-text rendering remains separate. The stable React 7 SDK still
uses `storyblok-js-client` transitively; this repository also retains its types
for public compatibility and uses it as an offline test oracle. The service's
HTTP requests all use the new client. See [fetching migration and server-data
checks](storyblok-fetching-migration.md) for pagination, bounded relation/link
resolution, preview isolation, cache scoping, retries and three-site validation.
The three sites continue to use the existing EU region.

[`@storyblok/schema`](https://www.storyblok.com/docs/libraries/js/schema) 0.5.0
is an optional schema-as-code authoring layer. Adopting it would change how
content models are managed; it is not needed merely to render the current
sites. No schema or content was pushed to Storyblok during this work.

## Component-type migration

`yarn gen-ts-schema` generates the active types from `components.82895.json`.
`yarn check:storyblok-types` verifies byte-for-byte reproducibility without
replacing them. Both commands are local and require no CMS token. An optional
space ID selects another checked-in snapshot. `yarn storyblok:types:candidate`
retains raw CLI output in the ignored `.storyblok/types-candidate/` directory.

The adapter normalizes legacy export shapes and string `filter_content_type`
values in a temporary copy, reuses the custom field parser, invokes CLI 4 with
the `Storyblok` suffix, and checks that output exists (CLI errors can exit 0).
It preserves the public `components-schema` import path and adds the official
asset, multilink and rich-text declarations. `@storyblok/js` is a direct
dependency because the generated types import it.

CLI 4 emits CMS number fields as strings. Existing component callers and
Storybook fixtures also pass numbers, so the adapter uses the TypeScript AST
and schema field metadata to widen **only number fields** to `number | string`.
Numeric consumers explicitly convert values where arithmetic or library props
require numbers. Other unknown fields remain `unknown`, rather than reverting
to the old catch-all `any` signature.

Application UUIDs, derived placeholders and supported legacy fields are declared
in `src/typings/storyblok-extensions.ts`; regeneration cannot erase them. A
mapped type preserves known fields when deriving component option types with
`Omit`. Custom table plugin rows/cells now have explicit string-array types.
Nullable assets, rich-text node unions and resolved/unresolved relations are
handled explicitly. Relation filters now use UUIDs, and searched/configured
page categories are combined into one flat array. The initial isolated check's
195 diagnostics have been resolved; the active TypeScript 7 check passes.

The new tests cover option types, numeric inputs, unknown-field safety,
resolved/unresolved category filtering, combined search filters and preview
field fallback order. The obsolete `generate-ts-schema.js` entry point delegates
to the official generator for compatibility.

`fetch-storyblok-components` now uses the pinned CLI's `components pull` and
preserves the root snapshot for local generation. It only updates the
snapshot after a fresh export exists. `push-storyblok-components` uses CLI 4's
component export directory and requires a prior pull for group/preset metadata.
CLI 4 includes that metadata in pushes; review it before running the command.
Neither network command was executed in this audit.

## Dependency security and consumer requirements

The official rich-text package and Tiptap still request Happy DOM 20, which has
an [upstream code-execution advisory](https://github.com/advisories/GHSA-834v-8h66-3h79).
Scoped resolutions select Happy DOM **21.0.4** for those parents, and tests use
21.0.4 as well. The HTML parser round-trip test passes with the patched version.
The missing `@floating-ui/dom` peer is supplied explicitly. The production
server dependency traces for all three sites contain no Happy DOM/Tiptap HTML
parser references; the site renderer uses the static structured-text entry.

The fresh audit also exposed older WebSocket copies in the existing wallet
stack. A compatible 7.5.11 override for `@ethersproject/providers/ws` and a
within-range refresh address those findings without changing ethers majors.

**Yarn consumers must carry the root `resolutions` from this branch**, including
the two parser overrides and WebSocket override. Dependency packages cannot
enforce their own Yarn resolutions. The isolated consumer preparation helper
copies them; the real websites checkout has deliberately not been modified.
Remove these temporary overrides after upstream parents request patched
versions and repeat the compatibility checks. The current audit remains at
26 advisories (0 critical, 11 high, 13 moderate, 2 low), with the same remaining
wallet/ethers and mitigated Storybook findings as the previous batch.

## Type-generation batch verification and artifacts

The subsequent fetching batch is documented in [storyblok-fetching-migration.md](storyblok-fetching-migration.md).
The results and archive below belong to the preceding type migration baseline.

- TypeScript 7 passes.
- 34 unit tests pass in 17 files, including preview lifecycle, editable roots,
  rich-text compatibility, feed escaping and the patched HTML parser.
- ESLint has 0 errors / 102 documented warnings; formatting passes for 439 files.
- All 8,529 rich-text HTML comparisons pass.
- Storybook production build passes at `/tmp/lumen-storybook-storyblok-types`.
- All three production builds pass at `/tmp/lumen-consumer-storyblok-types`,
  using each site's own environment and the reviewed dependency overrides.
- Parsed body markup matches the preceding runtime builds for all 1,505 static
  pages: Bali Internships 600, planet.training 698, Upskill 207. Inline body styles
  and attributes are included; scripts are excluded. No routes were added or lost.
  This does not compare external CSS, hydration behavior or browser pixels.
- Screenshots and authenticated Visual Editor smoke tests are pending.

The tested archive is `/tmp/lumen-candidate-storyblok-types.tgz`, SHA-256
`b16444409cf6aa6bd2dce0e7e3961c4eb15c472c325fb84712bcc3bfba724520`.
The packed source/config files match the current tree and its manifest matches
semantically. See `storyblok-types-verification.json` for this batch's evidence,
`storyblok-audit-summary.json` for the rich-text corpus inventory, and
`security-audit-summary.json` for the unchanged residual advisory counts.
The local rich-text corpus and pre-migration HTML are retained under
`.storyblok/richtext-audit/` (ignored by Git). Recheck them with:

```sh
STORYBLOK_RICHTEXT_CORPUS=.storyblok/richtext-audit/corpus.json \
STORYBLOK_RICHTEXT_BASELINE=.storyblok/richtext-audit/baseline.json \
yarn vitest run --project integration src/components/paragraph/richtext-corpus.integration.test.tsx
```
