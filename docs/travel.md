# Optional travel features

Travel now lives in `src/travel` and is published with `lumen-cms-core`. Public entry points and their implementation live together in `src/travel/`; there is no top-level travel directory. There is deliberately no restrictive package `exports` map: existing `lumen-cms-core/src/*` and `lumen-cms-core/config/*` consumers keep working.

## Opt in from a Pages Router website

Use core 2, Node 24, Next 16.4.3, and React/React DOM 19.3.1. Core's base Next config already transpiles `lumen-cms-core`; a separate travel package is no longer needed.

```tsx
// pages/_app.tsx
import 'lumen-cms-core/src/travel/client'
import 'lumen-cms-core/src/travel/styles.css'
export { LmDefaultApp as default, reportWebVitals } from 'lumen-cms-core'

// pages/[[...index]].tsx
export { pagesGetStaticPaths as getStaticPaths } from 'lumen-cms-core/src/server'
export { travelPagesGetStaticProps as getStaticProps } from 'lumen-cms-core/src/travel/server'
export { LmDefaultPage as default } from 'lumen-cms-core'

// pages/reisen/[slug].tsx, or pages/travels/[slug].tsx
export {
  getTravelStaticPaths as getStaticPaths,
  getTravelStaticProps as getStaticProps
} from 'lumen-cms-core/src/travel/server'
export { LmDefaultPage as default } from 'lumen-cms-core'

// pages/_document.tsx
export { LmDefaultDocument as default } from 'lumen-cms-core/src/server'
```

Install each desired API route with a one-line re-export:

```ts
// pages/api/categories.ts
export { default } from 'lumen-cms-core/src/travel/api/categories'
// pages/api/travel.ts
export { default } from 'lumen-cms-core/src/travel/api/travel'
// pages/api/travels.ts
export { default } from 'lumen-cms-core/src/travel/api/travels'
// pages/api/sitemap.ts
export { default } from 'lumen-cms-core/src/travel/api/sitemap'
```

The travel sitemap adds travel entries only to that handler instance. It does not mutate the shared core sitemap hook registry. Other sites can continue using `lumen-cms-core/src/pages/api/sitemap`.

`travelPagesGetStaticProps` registers travel data loaders after core initializes its hooks. Do not register them only in `_document`: it is not a reliable initialization point for page-data bundles. `registerTravelServerHooks`, `getTravelListData`, `fetchTravel`, and `fetchTravels` are also available from `/src/travel/server` for custom integrations.

## Auslandszeit is a separate opt-in

The German students site uses this jobs feed; the English site does not. In `_app`, additionally import `lumen-cms-core/src/travel/auslandszeit/client`. In the catch-all page:

```tsx
import type { GetStaticProps } from 'next'
import { travelPagesGetStaticProps } from 'lumen-cms-core/src/travel/server'
import { registerAuslandszeitServerHooks } from 'lumen-cms-core/src/travel/auslandszeit/server'
export const getStaticProps: GetStaticProps = (context) => {
  registerAuslandszeitServerHooks()
  return travelPagesGetStaticProps(context)
}
```

Keep the default page and static paths exports from the example above. `getAuslandszeitContent` is also exported by the Auslandszeit server entry point.

## Configuration

- `NEXT_PUBLIC_STORYBLOK_PUBLISHABLE_KEY`: public/published-content Storyblok token (formerly `NEXT_PUBLIC_PUBLIC_TOKEN`).
- `STORYBLOK_PREVIEW_TOKEN`: server-only preview token (formerly `NEXT_PUBLIC_PREVIEW_TOKEN`). Never give it a `NEXT_PUBLIC_` name.
- `TRAVEL_GRAPHQL_ENDPOINT`: travel GraphQL endpoint. The existing `NEXT_PUBLIC_GQL_HOSTNAME` is retained as a fallback. GraphQL client creation is deferred until an actual travel request.
- `TRAVELS_SLUG`: travel path prefix, for example `reisen` or `travels`.
- `NEXT_PUBLIC_TRAVEL_HEADER_FALLBACK_IMG`: optional detail-page fallback image.
- `AUSLANDSZEIT_API_KEY`: needed only when loading the jobs feed.

Core-only websites need none of the travel configuration. Default core client/server exports do not import travel, register its providers, include its CSS, add its routes, or call its backends. The npm download includes the feature source and the additional `locale-currency` dependency; browser/runtime inclusion is opt-in.

## Development and release

`students-de` and `students-en` remain independent repositories under `websites/standalone`, with their own pnpm lockfiles and workspace configuration. While core 2 is unpublished, they use `file:../../../lumen-cms-core`. Reinstall after changing the core checkout. Before deploying these repositories independently, publish core with the travel subpaths, replace that file dependency with the published version, and regenerate both lockfiles. Copy the environment-variable renames to the hosting environments.

The old `lumen-cms-travel` checkout is a compatibility facade: its former entry points forward to core. New integrations should use core directly. No separate implementation is maintained there.

`pnpm codegen:travel` reads an ignored local `schema.graphql` snapshot, or the file selected by `TRAVEL_SCHEMA_PATH`. It writes committed types/SDK files; ordinary builds do not need the snapshot or schema credentials. The former embedded admin credential is not part of the migrated generator config.

Regression tests check import-graph isolation, lazy endpoint validation, locale separation, repeatable client registration, hook setup, and independent sitemap handlers. The standalone sites intentionally retain their own locales, route names, and redirects.

## Migration verification

- Core: type check and lint/format gates pass; 443 unit tests pass. Existing lint warnings remain.
- Production builds: students-de 985 pages; students-en 902 pages; non-travel Bali reference 603 pages with travel environment variables unset.
- All 463 German and 490 English generated travel detail pages have settings and a travel block.
- Chromium smoke checks: both list/detail pages render, no hydration/page errors, travel/category APIs return 200 and the expected data.
- The core-only reference has no travel routes or travel implementation markers in its client/server JavaScript.
- The package dry run includes all public travel entry points and preserves the root/config files.

The migration also fixes hard-coded detail settings paths (which could silently render a 500 page with HTTP 200) and English currency hydration. The production builds still report malformed content links and oversized page data; those are separate content/core follow-ups.
