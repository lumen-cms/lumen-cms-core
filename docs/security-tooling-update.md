# Security and lint tooling update — 2026-10-27

Work is on `feature/mui-v9`, following Swiper commit `16c98d81`.
Screenshot comparisons are **on hold at the user's request** until the next
dependency upgrades are complete. Earlier visual results do not certify this
candidate. Do not merge on the strength of the earlier screenshots alone.

## Changes

- ESLint 8 → 10.13.0, `eslint-config-next` 13 → 16.4.3 and the TypeScript
  import resolver → 4.4.5. `eslint.config.mjs` replaces `.eslintrc.json` and
  retains the existing source scope and generated-file exclusions.
- Formatting still uses the existing Prettier 2 policy, now through
  `format:check` / `format:fix`. `lint` runs both code and formatting checks.
  Removed `eslint-plugin-prettier`; moved `eslint-config-prettier` to dev
  dependencies and upgraded it to 10.1.8. No repository-wide reformat.
- Storybook packages → 10.6.4. Its development command binds to loopback, and
  Webpack's public path is explicitly `/` to mitigate the middleware traversal
  condition described below.
- Refreshed vulnerable transitive packages within their declared ranges,
  including Babel traversal, crypto polyfills, form-data, shell-quote and
  node-gyp's archive/network dependency chain.
- All eight GraphQL Code Generator packages upgraded to their maintained
  versions. GraphQL stays at **16.14.2**. `test:codegen` exercises the plugins
  against an offline schema and type-checks the outputs using TypeScript 7.
- Two legacy codegen parents still request GraphQL Tools utilities v11.
  Scoped root resolutions for `plugin-helpers` and `visitor-plugin-common`
  select 12.1.0; all codegen smoke checks pass with the override. Remove these
  resolutions when the parents' supported ranges include patched utilities.
  They affect development tooling only and are not a consumer runtime fix.
- `graphql-request` 5 → 7.4.0 to match the generator's native Fetch types.
  Updated only the obsolete header type imports in the existing Shopify SDK;
  queries and operation bodies remain unchanged. Two unit tests cover request
  URL, variables, authentication and GraphQL error propagation without network
  access or real checkout requests.
- `js-cookie` → 3.0.8, `react-use` → 17.6.1 (eliminating its old cookie v2
  dependency), UUID → the patched 11.x line, and local-ssl-proxy → 2.0.5.
  Removed obsolete UUID types and the global node-fetch v2 resolution so each
  dependency can resolve its supported Fetch implementation.
- Replaced `next-dev-https` with Next's native `--experimental-https` mode and
  corrected the mismatched target port in `dev-safe`. Native HTTPS may need a
  local development certificate; no trust-store changes were performed.

The ESLint migration follows the [Next.js configuration documentation](https://nextjs.org/docs/app/api-reference/config/eslint).
Next 16.4.3 and React 19.3.1 themselves remain unchanged.

## Security triage

See `security-audit-summary.json` for the dated, individual advisories and
registry-reported dependency paths. Run `yarn audit:security` to refresh the
check, or append a file path to save a report. The command deliberately exits
nonzero while high/critical findings remain; there is no advisory allowlist.

The starting audit had 137 distinct advisories: 8 critical, 67 high, 45 moderate
and 17 low. These are advisory counts, not the registry's repeated path totals.
The final audit has **26 advisories: 0 critical, 11 high, 13 moderate and 2 low**.
111 starting advisories are absent; no new advisory IDs remain. A separate
production-only root audit reports 25 advisories, all in the wallet/ethers
chains; the additional high advisory is Storybook's development middleware.
The root audit includes development dependencies; it excludes the separate
legacy `base/` package. Registry paths sometimes attribute an affected version
to parents using a different version: verify exposure with `yarn why` and the
resolved package before treating every reported path as affected.

Remaining work:

| Dependency chain | Exposure and next action |
| --- | --- |
| WalletConnect v1 → JSON-RPC provider → axios 0.21.4 | Optional runtime integration, with 23 advisories including 10 high. Migrate the wallet integration to a maintained provider and validate connection, reconnect, signing and error behavior. Do not force a newer HTTP client across incompatible declared ranges and call the wallet migration complete. |
| WalletConnect v1 → query-string → decode-uri-component | One moderate advisory; address with the same wallet migration. |
| ethers v5 / web3-react → elliptic | One low advisory with no patched release reported. Requires a coordinated ethers/provider migration or isolation/removal of the integration if unused. Existing signing tests pass, which does not establish security against every advisory. |
| Storybook builder-webpack5 → webpack-dev-middleware 6.1.3 | One high advisory. The vulnerable condition is a publicPath without a trailing slash. This repo now explicitly uses `/` and binds Storybook to loopback. Static Storybook output does not run this middleware. Keep tracking a compatible upstream builder update; the audit still reports the installed version. |

The middleware mitigation is based on
[the upstream advisory](https://github.com/advisories/GHSA-g84c-rxfj-3j2c).
The codegen override addresses
[mergeDeep pollution](https://github.com/advisories/GHSA-7mx3-vvmw-hjmv) and
[incremental-result pollution](https://github.com/advisories/GHSA-c4qx-w738-7hr3).
No inference that all websites exercise the optional wallet code has been made.
The website repositories also need their own dependency audits and lockfile
updates; the library's lockfile does not control consumers' transitive versions.

## Lint adoption and remaining checks

The old lint rules continue to gate the build. Four newly recommended React
Compiler rules are temporarily warnings: `static-components`, `set-state-in-effect`,
`immutability` and `refs`. They expose 47 existing diagnostics across the source;
they have not been fixed or hidden. The library does not enable React Compiler.
Promote these rules after a dedicated component review with visual and behavior
checks. Lint currently also reports existing unused-disable warnings.

## Verification

| Check | Result |
| --- | --- |
| TypeScript 7 | Pass |
| ESLint 10 | Zero errors; 103 warnings, including 47 newly exposed compiler diagnostics and 55 unused-disable warnings |
| Existing Prettier policy | 430 files checked, zero changes needed |
| Vitest | 23 tests pass across 12 files |
| Codegen smoke + generated TypeScript | All eight packages exercised; pass, including the scoped utility override |
| Static Storybook build | Pass, output `/tmp/lumen-storybook-security-final` |
| Bali Internships production build | Pass with its own environment |
| Planet Training production build | Pass with its own environment |
| Upskill production build | Pass with its own environment |
| Native HTTPS / proxy CLI options | Available; no certificate trust-store changes or HTTPS session started |
| Security audit gate | Intentionally fails: 11 high advisories remain visible |
| Screenshot comparisons | Deferred at user's request, not run for this batch |

Consumer checks used `/tmp/lumen-consumer-security` and
`/tmp/lumen-candidate-security-final.tgz` (SHA-256
`046c35f75625b1e3a800e1434252bc1e02d6c76790198ef2e2f7987f64d11a63`).
All 477 packed source/client/config files match this working tree. The only
later manifest difference is the two development-only GraphQL codegen
resolutions, tested separately; runtime dependencies match the built candidate.
The original websites checkout is unchanged. The consumer preparation helper
continues to apply the previously documented Planet Training redirect patch.

Visual acceptance, preview/editor behavior, browser coverage and real Google
Form receipt confirmation remain separate merge checks from the earlier plan.
