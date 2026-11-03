# Lumen CMS shared

Framework-independent content utilities, types, delivery clients, enrichment,
and optional travel helpers used by `lumen-cms-astro`. Published source files are
self-contained: no relative imports into the Next CMS checkout, React/Next/MUI
runtime or type dependencies, or implicit repository assets.

`src/core` contains the extracted delivery and compatibility implementation.
The existing Next implementation remains in the root `src` to keep legacy npm
consumers independent during migration. These are separate module instances:
Astro hooks and mocks must use the shared package, not the root Next modules.
When changing delivery behavior, retain parity tests between both implementations.
Generated Storyblok/GraphQL schemas can be refreshed with
`pnpm astro:sync-schemas` after the existing code generation commands.

Imports use explicit subpaths such as `lumen-cms-shared/theme`,
`lumen-cms-shared/server/routes`, and
`lumen-cms-shared/core/typings/generated/components-schema`. Prefer the renderer's
`server/pages`, `server/config` and `server/travel` APIs for consumer data loading.

The package stays private. Install it from a packed artifact or pinned Git
subdirectory alongside the matching Astro package; see its README. Vendor
licenses are retained under `src/vendor` and `src/core/vendor`.
