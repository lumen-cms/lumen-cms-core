# Next.js Storyblok Boilerplate

## Local development

Use Node.js 24 (`nvm use`) and the repository's pinned pnpm version. Install with
`pnpm install --frozen-lockfile`, then run `pnpm dev`. Next.js development and
production builds use Turbopack. Storybook retains its separate webpack builder.

For everyday development, select a website with one command:

| Command | Local URL |
| --- | --- |
| `pnpm dev:bali` | http://127.0.0.1:3009 |
| `pnpm dev:planet` | http://127.0.0.1:3010 |
| `pnpm dev:upskill` | http://127.0.0.1:3011 |

Each command loads one private file containing the site's tokens and settings:
`.env.bali`, `.env.planet`, or `.env.upskill`. These files are ignored by Git.
Edit the selected site's file once instead of commenting settings in and out of
`.env`. Stop with Ctrl+C to switch sites; restart after editing settings.

Next.js automatically loads `.env`, `.env.local`, and files for its standard
`development`, `production`, and `test` environments. Project names are not
Next.js environments: do not set `NODE_ENV=bali` (or another project name).
The commands use `dotenv-cli` (`dotenv -e .env.<project> -- next dev`) to
load the chosen file before starting Next.js directly. `--no-expand` preserves
literal values, matching the previous loader. No custom launcher or reference-token
lookup is used. Shell variables take priority over the project file; Next.js's
standard env files provide any missing values. Keep only shared defaults there.
Each site keeps its own build cache under `.next-reference/<site>`.

Build a selected site with the same env file and output folder:

```bash
pnpm build:bali
pnpm build:planet
pnpm build:upskill
```

These commands run the existing `build` script, including its TypeScript check,
with the selected project's environment loaded for the entire build.

For a fresh checkout, create these ignored files using the site's credentials
and existing settings. Use the application's normal variable names:

```dotenv
STORYBLOK_PREVIEW_TOKEN="<space-preview-token>"
NEXT_PUBLIC_STORYBLOK_PUBLISHABLE_KEY="<space-public-token>"
# Add this site's language, root-directory, or other settings here.
```

Existing boolean settings commonly treat any nonempty string as enabled. Use
an empty value to disable those settings, rather than the string `false`.

This runs the core repo's existing Next.js application against the selected
Storyblok space. It does not load a consumer website's custom Next config or
components from `../websites`.

Plain `pnpm dev` still uses the original workflow at port 3000: select the
Storyblok space tokens in the ignored `.env` file:

```dotenv
STORYBLOK_PREVIEW_TOKEN=<space-preview-token>
NEXT_PUBLIC_STORYBLOK_PUBLISHABLE_KEY=<space-public-token>
```

Spaces with different locale or folder structures may also need the
`NEXT_PUBLIC_ROOT_DIRECTORY` and locale settings used by their deployed site.
The named launchers leave the application, routing, and rendering logic unchanged.

Use pnpm consistently. When switching from Yarn, move the old `node_modules`
directory aside before installing; do not mix dependency layouts. Clear the
application's old `.next` build cache when switching bundlers, then restart the
development server to avoid stale chunk URLs.

## Dependency usage audit

Run `pnpm audit:deps` to check unused dependencies with the pinned, project-local
[Fallow CLI](https://www.fallow.tools/docs/cli/dead-code/). Findings return a
nonzero exit status when error-level issues remain; this command does not remove
packages. For other analyses, use `pnpm exec fallow --help`.

The configuration includes published source/config subpaths, excludes the
historical `base/` package (outside the pnpm workspace), and keeps the Storyblok
CLI subprocess and TypeScript helper dependency as documented exceptions.
Review findings against scripts, peer requirements and consumer usage before
removing packages.

## Core 2.0 / websites migration

Core 2.0 requires Node.js 24, Next.js 16 and React 19. Keep
`transpilePackages: ['lumen-cms-core']` in the consumer Next config: the package
ships TypeScript source. The shared config no longer installs a webpack hook or
uses `next-transpile-modules`. Its old development/production wrappers remain
compatible entry points that merge `transpilePackages`. Use `pnpm analyze` for
Turbopack bundle analysis.

The shared config also bundles `@mui/lab` so its tab providers use the same
Material UI context as the renderer during server rendering.

It enables `experimental.turbopackClientSideNestedAsyncChunking`, matching
Turbopack's production default in development. This avoids missing preload
chunks for nested dynamic slider imports on Next 16.4.3
([upstream issue](https://github.com/vercel/next.js/issues/99149)). Keep this
shared experimental setting when adding consumer-specific experimental options.

No custom `experimental.optimizePackageImports` list is needed. Next 16 already
optimizes `@mui/material`, `@mui/icons-material`, `date-fns`, and `react-use` by
default. Lab components and MDI icons already use direct subpath imports. The
core entry point is small and initializes the CMS component registry through
side-effect imports; add an optimization for it only after measuring a benefit
and verifying registration and lazy-component boundaries. See the
[Next.js option reference](https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports).

Internal imports now resolve within the package. Consumers no longer need
`@CONFIG`, `@SSR_CONFIG`, `@LmComponentRender` or `@context/*` aliases, or paths
into a hoisted `../../node_modules` directory. Configure the exported `CONFIG`
and component registry through the normal `lumen-cms-core` imports.

The sibling `websites` repository uses pnpm workspaces and a shared
`tsconfig.base.json`. Each website runs a strict TypeScript check before building;
build errors are no longer ignored. Its production dependency is the published
`lumen-cms-core@2.0.0`, never a link to this checkout.

Release order:

1. Review and publish core `2.0.0`. The existing registry version `1.11.1` targets
   Next 13 / React 18 and cannot be substituted for this migration.
2. In `websites`, move the old Yarn `node_modules` directories aside, run
   `pnpm install`, and commit the resulting `pnpm-lock.yaml` with the migration.
   A registry lockfile cannot be generated until core `2.0.0` is published.
3. Run `pnpm check-types`, then the website builds. Configure deployment to use
   Node 24 and `pnpm install --frozen-lockfile` from the workspace root.

To verify before publishing, `scripts/prepare-consumer-verification.cjs` accepts
a `pnpm pack --out <archive.tgz>` archive and creates an isolated pnpm workspace
for all 12 consumers (or one selected directory). This verifies package contents
and isolated dependency resolution without changing production dependency URLs.

When upgrading an existing deployment, rename `NEXT_PUBLIC_PUBLIC_TOKEN` to
`NEXT_PUBLIC_STORYBLOK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_PREVIEW_TOKEN` to
`STORYBLOK_PREVIEW_TOKEN`, and `NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN` to
`NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLISHABLE_KEY`. Keep their values unchanged;
the preview token must stay server-only.

## Validation during the upgrade

- `pnpm test`: offline Vitest tests for Google Forms parsing, news feeds and signing.
- `pnpm check-types`: strict TypeScript 7 check. The `@typescript/native` alias
  provides `tsc` 7.0.2. The `typescript` alias supplies Microsoft's TypeScript 6
  API compatibility package for ESLint/Next tooling; it does not replace this
  TypeScript 7 gate. See [Microsoft's side-by-side guidance](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-60).
- `pnpm test:integration`: explicit live Storyblok/Google Forms checks. Copy
  `.env.test.example` to `.env.test.local` and supply the listed space tokens.
  These depend on external content and are separate from the offline suite.
- `pnpm storybook` / `pnpm build-story`: interactive or static component stories.
  These commands no longer copy a Babel config into the application root.
- `pnpm test:visual`: build and compare Storybook in Chromatic, using
  `CHROMATIC_PROJECT_TOKEN` from your environment. Review changes in the existing
  project; this command does not automatically accept a new baseline.

## Website regression tests against production

```bash
pnpm test:website:install # One-time Chromium download
pnpm test:website:bali
pnpm test:website:planet
pnpm test:website:upskill
```

Each command compares **30 routes at desktop and mobile sizes** (60 comparisons)
with fresh captures of the live website. It packages the current core, builds an
isolated copy of the actual consumer from `../websites`, starts its production
server, and saves live/local/difference PNGs plus HTML and JSON reports in
`.website-tests/results/<site>/<timestamp>/`. Differences and failed captures
return a nonzero exit code. Original consumer checkouts and `.env` stay intact.

The consumer checkout must contain its own website credentials. Use
`--websites-root /path/to/websites` for another checkout location, `--list` to
inspect the route matrix, or `--limit 3` for a quick run. Browser tooling is a
development dependency and is not included in the published package.

See [website testing](docs/website-testing.md) for configuration, comparison
rules, limitations, and the distinction from the simpler reference profiles below.

## Reference websites

Copy `.env.reference.example` to the ignored `.env.reference.local` and supply
the public/preview tokens for each named website. These profiles are separate
from the older integration-test fixtures. They keep `.env` intact and use
isolated build folders, so one site's build cannot be served as another site.

```bash
pnpm reference:site build bali --smoke
pnpm reference:site start bali
# Repeat with planet or upskill in another terminal.
```

The ports are 3009 (Bali), 3010 (Planet), and 3011 (Upskill). Use `dev` instead
of `build`/`start` for development. Omit `--smoke` for full static path generation;
smoke builds use the repository's existing limited path selection. Build commands
run the TypeScript 7 check first. Other locale/root-directory settings are
inherited from `.env`, `.env.local`, and the shell; match each deployment's
settings when comparing alternate environments. The reference commands retain their
separate `.env.reference.local` credentials; everyday `dev:<site>` commands use
the project files described above.

The Google Forms fixtures use static data and an empty API setting, so their
validation and selection tests cannot submit to Google. The local compatibility
fork preserves the existing parser, renderer and submission encoding.

A passing unit suite or Storybook build is not visual approval. Before accepting
React/MUI upgrades, compare approved component snapshots and the main-navigation
routes of planet.training, upskill.study and baliinternships.com on desktop and
mobile. Match published/draft content, locale, root directory, fonts and images
between runs. Review every changed snapshot; do not auto-accept a new baseline.

See [the dependency upgrade plan](docs/dependency-upgrade-plan.md) for the staged
migration and [verification record](docs/migration-verification.md) for release checks.

## How to get started?

1. [Register](https://app.storyblok.com/#!/signup) at Storyblok for free
2. Create a new empty Space and exchange the preview token with your own in ```utils/StoryblokService.js``` (not required if you have downloaded the project via app.storyblok.com)
3. Read the Next.js tutorial about Storyblok's concept: https://www.storyblok.com/tp/next-js-react-guide
4. Enjoy and start developing

## Build Setup

``` bash
# install dependencies
$ npm install # Or pnpm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start
```

For detailed explanation on how things work, checkout the [Next.js docs](https://nextjs.org/docs/#setup).

## Security migration: browser credentials

Use `STORYBLOK_PREVIEW_TOKEN` instead of `NEXT_PUBLIC_PREVIEW_TOKEN`.
Preview credentials are read only on the server; never serialize `CONFIG` into
page props. Browser list/search requests now use published content, including
inside the editor. Server-rendered previews remain available; fetching additional
draft content in the browser requires an authenticated server endpoint.
`NEXT_PUBLIC_PREVIEW_MODE` no longer switches the public token to a preview token.

Rename `NEXT_PUBLIC_PUBLIC_TOKEN` to
`NEXT_PUBLIC_STORYBLOK_PUBLISHABLE_KEY`, using a Storyblok **Public** token that
can read published content only. For the legacy Shopify config, use
`NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLISHABLE_KEY` instead of
`NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN`, with a **public Storefront** token, never an
Admin or private Storefront token. Instagram API URL creation is server-only;
rename `NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN` to `INSTAGRAM_ACCESS_TOKEN` and do
not send the resulting credential-bearing URL to browsers.

Update deployment environments before rebuilding. Rotate preview credentials
present in previously deployed Next.js or Storybook bundles, rebuild/redeploy
those applications, and retire old hosted artifacts and source maps. The local
comparison builds are historical evidence and do not update when source changes.

## Security migration: CMS click actions and product descriptions

The `on_click_function` CMS field now selects a named application handler. It no
longer executes JavaScript snippets. Register handlers during application setup,
then put only the matching name (for example `open-contact`) in the CMS field:

```tsx
import { cmsClickActions } from 'lumen-cms-core'

cmsClickActions.set('open-contact', () => {
  document.getElementById('contact')?.scrollIntoView()
})
```

Unregistered names and legacy JavaScript snippets do nothing; ordinary links
and explicit React `onClick` props retain their behavior. Migrate existing CMS
snippets into application code before deploying. Registered actions are public
UI behavior, not an authorization mechanism, and must not close over per-request
server state.

Shopify descriptions preserve text, headings, lists, tables, safe links, and
images. Scripts, event handlers, styles, embedded frames, SVG, and unsafe URL
schemes are removed before rendering, both on the server and in the browser.

## Iframe sandbox policy

CMS embeds are sandboxed independently of their existing `allow` feature policy
and fullscreen setting. Unknown URLs and same-origin pages may run scripts,
submit forms, and present media, but receive an opaque origin and cannot open
popups or navigate the parent page. Storage-dependent new providers require a
code review of `src/components/iframe/iframeSandbox.ts` before being added.

The exact HTTPS origins used by the reference sites have explicit permissions:

| Provider | Additional permissions and purpose |
| --- | --- |
| YouTube and YouTube nocookie | Normal origin for player storage, presentation, and popups for provider links |
| Google Docs/Forms | Normal origin for form/session behavior, forms, and popups for sign-in links |
| StudentsGoAbroad application portal | Normal origin, forms, popups, and document downloads |

Provider popups may escape the sandbox so their destination pages and sign-in
flows work normally. The embedded page itself still cannot navigate the parent.
These are trusted-provider exceptions, not isolation from malicious behavior by
those providers. The scripts/origin permission pair is never granted when the
provider origin equals the parent origin, and subdomains, lookalike hosts, HTTP,
and non-default ports do not inherit trust. CMS content cannot set the policy.

The GTM `noscript` iframe grants only `allow-same-origin`, preserving its normal
origin and image-based requests without allowing scripts, forms, popups, or
parent navigation. The JavaScript GTM path is unchanged. Browser consent,
tracking-prevention, and third-party-cookie policies still apply.


## Optional travel integration

Travel and Auslandszeit are opt-in subpaths of this package. See [the travel integration guide](docs/travel.md) for client registration, page loaders, API routes, and migration from `lumen-cms-travel`.
