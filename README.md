# Next.js Storyblok Boilerplate

## Local development

Use Node.js 24 (`nvm use`) and the repository's pinned Yarn version. Install with
`yarn install --immutable`, then run `yarn dev`. Development and production
builds use Webpack explicitly because the shared configuration relies on it.

The local site is selected by the Storyblok space tokens in the ignored `.env`
file:

```dotenv
NEXT_PUBLIC_PREVIEW_TOKEN=<space-preview-token>
NEXT_PUBLIC_PUBLIC_TOKEN=<space-public-token>
```

Restart the dev server when switching spaces. Spaces with different locale or
folder structures may also need the `NEXT_PUBLIC_ROOT_DIRECTORY` and locale
settings used by their deployed site.

Use Yarn consistently: a `node_modules` directory left by pnpm can retain
symlinks to incompatible versions even after a Yarn install. Move that directory
aside before making a clean Yarn installation if package versions disagree with
`yarn.lock`.

## Validation during the upgrade

- `yarn test`: offline Vitest tests for Google Forms parsing, news feeds and signing.
- `yarn check-types`: strict TypeScript 7 check. The `@typescript/native` alias
  provides `tsc` 7.0.2. The `typescript` alias supplies Microsoft's TypeScript 6
  API compatibility package for ESLint/Next tooling; it does not replace this
  TypeScript 7 gate. See [Microsoft's side-by-side guidance](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-60).
- `yarn test:integration`: explicit live Storyblok/Google Forms checks. Copy
  `.env.test.example` to `.env.test.local` and supply the listed space tokens.
  These depend on external content and are separate from the offline suite.
- `yarn storybook` / `yarn build-story`: interactive or static component stories.
  These commands no longer copy a Babel config into the application root.
- `yarn test:visual`: build and compare Storybook in Chromatic, using
  `CHROMATIC_PROJECT_TOKEN` from your environment. Review changes in the existing
  project; this command does not automatically accept a new baseline.

## Reference websites

Copy `.env.reference.example` to the ignored `.env.reference.local` and supply
the public/preview tokens for each named website. These profiles are separate
from the older integration-test fixtures. They keep `.env` intact and use
isolated build folders, so one site's build cannot be served as another site.

```bash
yarn reference:site build bali --smoke
yarn reference:site start bali
# Repeat with planet or upskill in another terminal.
```

The ports are 3009 (Bali), 3010 (Planet), and 3011 (Upskill). Use `dev` instead
of `build`/`start` for development. Omit `--smoke` for full static path generation;
smoke builds use the repository's existing limited path selection. Build commands
run the TypeScript 7 check first. Other locale/root-directory settings are
inherited from `.env`, `.env.local`, and the shell; match each deployment's
settings when comparing alternate environments.

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
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start
```

For detailed explanation on how things work, checkout the [Next.js docs](https://nextjs.org/docs/#setup).

