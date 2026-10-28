# Wallet extraction — 27 October 2026

Core branch: `feature/mui-v9`. The independent local Git repository is
`/Users/dominicgarms/Documents/Coding/react/lumen-cms-web3`. It has no remote and
has not been committed, pushed or published. It is not a workspace of core.
Screenshots remain paused. Business-site Web3 usage was confirmed absent by
the owner; no CMS inventory or remote schema edits were performed.

## Package boundary

Moved wallet components/connectors/hooks, RPC/signing utilities and the signing
unit test out of core. Historical Storybook and API-route examples are preserved
as non-executable reference files in the new repository. Removed the default
`/api/sign/message` route, shared `CONFIG.web3MintFunction` and its ethers types,
wallet setup comments, and seven direct wallet dependencies from core. The
wallet-specific ws resolution was removed too.

The standalone package exposes `createWeb3Plugin` with explicitly supplied
component/rich-text renderers and mint callback. Its provider uses a per-instance
React context rather than importing the site's registry/configuration aliases.
CMS component names are retained. Signing helpers have a separate `/server`
export, rejected under the browser export condition. No API route is installed
automatically. A native ESM import check found and fixed the Next dynamic import
extension before the final archive was produced.

Core does not depend on the extracted package. The generated CMS schema still
contains the wallet block interfaces because they describe the shared schema;
these introduce no wallet runtime dependency. The new package consumes those
types through its core peer dependency. Its small development-only packed core
fixture makes the unpublished candidate reproducible without an absolute path;
replace that fixture with the reviewed core release when published.

The extracted wallet package preserves legacy ethers 5, WalletConnect 1 and
web3-react dependencies. It is explicitly private pending its own security
migration; extraction does not remediate that package. Its README and SECURITY.md
record integration steps and outstanding wallet/signing review. No live wallet
connections, signatures with real keys, transactions or form submissions were
performed.

## Verification

| Check | Result |
| --- | --- |
| Core TypeScript 7 | Pass |
| Core unit tests | 53 tests in 18 files pass; one signing test moved to the new package |
| Standalone package | TypeScript 7 build, 3 tests, immutable install and pack pass |
| Package exports | Emitted client/server imports succeed; browser server import rejected |
| Core immutable install | Pass |
| Core lint/format | Pass; 0 errors, 102 existing warnings |
| Core Storybook production build | Pass |
| Core dependency/package boundary | Manifest, lockfile, removed source/config and packed-file checks pass |
| Bali Internships production build | Pass, own environment |
| Planet Training production build | Pass, own environment |
| Upskill production build | Pass, own environment |
| Complete serialized page props | 1,496 comparisons pass: Bali 597, Planet 694, Upskill 205; zero differences |
| Production HTTP smoke | 10 requests across home/deep/translated routes return 200 with Next page data |
| Core production dependency audit | 0 vulnerabilities across 514 reported dependencies |
| Full core audit including dev tooling | 3 findings: 1 high, 1 moderate, 1 low; all Storybook dependency paths |
| Screenshots | Paused; not performed |

Page-prop comparison uses the previously documented normalization of only the
volatile list timestamp and Google Forms hidden token. Counts, ordering,
translations, content and all remaining page props match. HTTP smoke checks do
not establish browser hydration or interaction correctness. Earlier screenshot
acceptance does not certify the current candidate.

The remaining development findings are webpack-dev-middleware 6.1.3 (high,
existing loopback/publicPath mitigation), bn.js 5.2.1 (moderate, patched version
available), and elliptic 6.6.1 (low). These now resolve through Storybook's builder
and crypto polyfill, not through wallet packages. The full audit still exits
nonzero. Its report is [security-audit-summary.json](security-audit-summary.json).

Evidence and artifact SHA-256 values:
[web3-extraction-verification.json](web3-extraction-verification.json).
The three isolated consumers contain no wallet packages, and the original
websites checkout remains unchanged.

## Reproduce

```sh
node scripts/check-wallet-boundary.cjs /tmp/lumen-candidate-no-web3.tgz
yarn test:page-data \
  /tmp/lumen-consumer-storyblok-api-final \
  /tmp/lumen-consumer-no-web3 \
  /tmp/lumen-no-web3-page-data.json
```

The existing consumer preparation helper builds all three sites using the packed
candidate and their own copied environments. The sibling package includes its
own lockfile, tests, build configuration, license and integration documentation.
Core has a breaking removal for any external consumers of its former wallet
paths/configuration; such consumers must explicitly install the extracted
package. Business-site rendering was not changed by this extraction.
