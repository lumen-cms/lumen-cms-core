# Unsupported integration replacements — 27 October 2026

Branch: `feature/mui-v9`. Screenshot comparisons remain paused. No remote
publishing, real form submissions, microphone access or audio playback occurred.

## Script loading

Replaced deprecated `@charlietango/use-script` 2.3.0 with the maintained
`@charlietango/hooks` 2.3.0 subpath `use-script`. The replacement declares
React 18/19 peers and returns a typed status string instead of the former tuple
and enum. All four callers were migrated: Facebook chat, Tawk.to chat, HubSpot
forms and HubSpot meetings. Lazy loading and editor guards remain.

A small `useExternalScript` adapter records the final status on the persistent
script node if it finishes while every hook consumer is unmounted. Upstream
removes its listeners on unmount while retaining the script; without this
adapter a later navigation can be stuck in loading. The recorder has no React
state, is shared per script and removes its listeners when the request settles.
The tests exercise this case using the actual replacement hook.

Additional lifecycle fixes:

- Facebook initializes its global callback in an effect before the loader's
  effect, rather than accessing `window` during server rendering. Cleanup restores
  the previous callback when appropriate.
- HubSpot meetings use a stable per-instance/configuration script URL. The old
  `Date.now()` URL changed on every render and could repeatedly execute the
  embed after load/status updates. A new instance or changed meeting/embed
  configuration can still execute its embed script. Rendered container markup
  and meeting URL behavior are preserved.
- HubSpot forms initialize once per configuration under React Strict Mode.
  Configuration changes replace the old target contents; ordinary rerenders
  do not duplicate the embed. Added explicit vendor API types.

Reference: [maintained hooks](https://github.com/charlie-tango/hooks),
[registry metadata](https://registry.npmjs.org/@charlietango%2Fhooks/latest).

## Speech synthesis

The latest `react-speech-kit` remains 3.0.1 with React-16-only peer metadata.
Core uses only its synthesis hook, so it was replaced with a typed native
SpeechSynthesis wrapper rather than retaining unsupported peer declarations or
adding another speech framework. No speech-recognition/microphone feature was
introduced.

`useSpeechSynthesis` retains the used speak/cancel/speaking/supported/voices
contract, option defaults and fresh utterances. Voice discovery uses
`useSyncExternalStore`, handles both immediate and delayed voices, and subscribes
without overwriting another consumer's voiceschanged handler. End/error events
reset speech state; unmount removes subscriptions and cancels owned active
speech. The platform only offers cancellation of its global speech queue.

The existing button markup, labels, locale-based voice selection and full-page
versus section text selection are retained. The initial unsupported server
render is preserved for hydration. Obsolete type suppressions were removed.
Tests mock the native API; actual OS voices/audio playback remain browser
acceptance work.

References: [SpeechSynthesis API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis),
[old package metadata](https://registry.npmjs.org/react-speech-kit/latest).

## Security headers

Removed `next-safe`. Even its latest 3.5.0 only declares Next support through 14,
but this repository never called it: the call and CSP construction were already
commented out. The helper now returns fresh copies of the same five header
entries through Next's existing native `headers()` configuration. Removed the
unused import and dead policy configuration; the public helper path and accepted
options remain compatible.

A fixture captured from the pre-change helper protects exact header values.
Production HTTP checks also verify all five values. No new CSP was enabled:
`contentSecurityPolicy`/`ignoreCsp` were already ineffective in this helper.
Any future policy rollout needs its own external-resource/editor review.

References: [Next headers](https://nextjs.org/docs/pages/api-reference/config/next-config-js/headers),
[next-safe metadata](https://registry.npmjs.org/next-safe/latest).

## Verification

| Check | Result |
| --- | --- |
| TypeScript 7 | Pass, including final sources |
| Unit tests | 67 pass in 21 files; 14 integration-specific tests also rerun against final sources |
| Lint/format | Pass; 0 errors, 99 warnings (previously 102) |
| Immutable core install | Pass |
| Final static Storybook build | Pass |
| Bali Internships production build | Pass using its own environment |
| Planet Training production build | Pass using its own environment |
| Upskill production build | Pass using its own environment |
| Complete page-prop comparison | 1,496 routes pass, zero differences: Bali 597, Planet 694, Upskill 205 |
| Production HTTP checks | 10 routes return 200 with Next data; all five security headers match on every request |
| Core production dependency audit | 0 vulnerabilities across 511 reported dependencies |
| Full dependency audit | Unchanged: 3 Storybook tooling findings (1 high, 1 moderate, 1 low) |
| Wallet boundary check | Pass |
| Original websites checkout | Unchanged |
| Screenshots | Paused, not performed |

The 14 new tests cover script enablement, status changes, deduplication, delayed
completion after unmount, Strict Mode form initialization, meeting rerenders,
chat lazy loading, SSR without window, immediate/delayed voices, speech options,
finish/error/cancel/unmount, unsupported browsers and exact header compatibility.
External script loading is disabled in DOM tests; vendor events/APIs are mocked.
These tests establish integration lifecycle behavior, not current third-party
service availability or browser visual acceptance.

Page-data comparison uses the existing two narrow volatile timestamp/form-token
normalizations. Baseline: `/tmp/lumen-consumer-no-web3`; candidate:
`/tmp/lumen-consumer-integrations`. The candidate package dependency manifest
matches the current workspace. Evidence and archive hash:
[unsupported-integrations-verification.json](unsupported-integrations-verification.json).

```sh
yarn test:page-data \
  /tmp/lumen-consumer-no-web3 \
  /tmp/lumen-consumer-integrations \
  /tmp/lumen-integrations-page-data.json
```

No screenshot baseline was accepted. The final visual/editor/browser checks
remain separate from these passing build, data and HTTP checks.
