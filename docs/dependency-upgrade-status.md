# Dependency upgrade status — 27 October 2026

Branch: `feature/mui-v9`. Screenshots remain paused. Earlier batches are described in
[web3-extraction.md](web3-extraction.md), [unsupported-integrations.md](unsupported-integrations.md)
and [storyblok-fetching-migration.md](storyblok-fetching-migration.md).

## Remaining packages below the registry latest tag

| Package | Installed | Latest | Status |
| --- | --- | --- | --- |
| `graphql` | 16.14.2 | 17.0.2 | Intentional hold (codegen/graphql-request ecosystem) |
| `@types/node` | 24.19.2 | 26.6.5 | Intentional hold; matches the Node 24 engine |
| `prettier` | 2.7.1 | 3.9.10 | Optional; produces a repository-wide formatting diff |
| `cross-env` | 7.0.3 | 10.1.0 | Optional tooling |
| `dotenv` | 16.0.3 | 18.0.9 | Optional tooling |

The Git-based Storyblok icon plugin and the legacy `base/` package are outside this list.

## Final upgrade batch

- **Zustand 4.1.5 → 5.0.16.** Named `create` import; object selectors use `useShallow`
  (toolbar drawer button, FastSpring checkout); single-field auth selectors no longer
  pass an equality function. New tests cover drawer toggling and the auth store.
- **React Intersection Observer 9.4.1 → 11.0.1.** No API changes needed; no caller
  used `onChange`, whose initial `false` emission v10 dropped.
- **React Rewards 2.0.4 → 3.0.0.** The timeline passes a ref plus the `confetti`,
  `emoji` or `balloon` effect; `elementCount` maps to `count`.
- **React Aspect Ratio removed.** `ImageBase` uses native CSS `aspect-ratio` and keeps
  the `react-aspect-ratio-placeholder` class.
- **Nuka Carousel removed.** v8 dropped controlled `slideIndex`, `slidesToShow`,
  `adaptiveHeight`, `pauseOnHover` and `disableAnimation`. `LmNukaCarousel` keeps its
  props and controls but now runs on Swiper 14 (loop, autoplay, auto height, controlled
  index, `beforeSlide`/`afterSlide`). Used by Slider, Tabs, the image-list lightbox and
  the Shopify product carousel.
- **React Player 2.10.1 → 3.4.0.** `react-player` import (no `/lazy`), `src` instead of
  `url`, `playsInline`, and a `div` wrapper with v2's 640×360 default size.
  `videoUrlHelper` now picks the first source the browser can play from
  `url_internal`/`url_alternatives`/comma-separated URLs. v3 drops Dailymotion,
  SoundCloud, Streamable, Facebook, Mixcloud and Kaltura; the three sites' published
  players only use YouTube and one Storyblok MP4.
- **next-seo 6.8.0 → 7.3.0.** Head tags use `generateNextSeo` from `next-seo/pages`
  inside `next/head` (byte-identical to the v6 fixtures). Logo, social profile and
  corporate contact use `OrganizationJsonLd`; local business uses `JsonLdScript` to
  keep `@id`; product sellers stay `Organization`. JSON-LD is now rendered inline in
  the body rather than through `next/head`, each script with its own id.
- **Removed:** `node-fetch`, `@formatjs/intl-datetimeformat`, `uuid` (Storybook uses
  `crypto.randomUUID()`), and the polyfills `intersection-observer`, `element-closest`,
  `smoothscroll-polyfill`, `abortcontroller-polyfill`. `client/polyfills.js` and the
  `@polyfills` client entry were deleted; Next 16 browser targets support these APIs.
  Consumer tsconfig `@polyfills` paths are now unused and can be removed. Unused
  type packages `@types/scrollmagic`, `@types/debug` and `@types/match-sorter`
  (deprecated stub) were removed.
- **Minor/patch:** Auth0 React, cors, nextjs-cors, graphql-tag, postcss, tslib,
  ts-node and the `@types/*` packages (`@types/react-big-calendar` 0.38 → 1.16).
  `yarn dedupe` removed a stale `postcss@8.4.18` lock entry (and its old `nanoid`
  and `source-map-js`) that carried ten advisories.

## Verification

| Check | Result |
| --- | --- |
| TypeScript 7 | Pass |
| Unit tests | 109 pass in 26 files |
| Lint / format | 0 errors, 99 warnings / pass |
| Immutable install | Pass |
| Static Storybook build | Pass |
| Production builds (Bali, Planet, Upskill) | Pass using their own environments |
| Page-prop comparison vs `/tmp/lumen-consumer-integrations` | 1,496 routes, zero differences |
| Security audit (`yarn audit:security`) | 3 known Storybook tooling findings (1 high, 1 moderate, 1 low) |
| Browser smoke (Bali production build) | Carousel arrows/dots/loop, Tabs slide selection and YouTube players work |

Candidate archive: `/tmp/lumen-candidate-npm-upgrades.tgz`; consumers:
`/tmp/lumen-consumer-npm-upgrades`.

Not verified: browser playback of the Storyblok-hosted MP4 player, the confetti
effect (no published timeline has confetti configured), Firefox/Safari, and screenshot
comparisons. These belong to the final visual and browser acceptance pass.
