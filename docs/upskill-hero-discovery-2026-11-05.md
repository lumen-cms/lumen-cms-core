# Upskill hero discovery — 2026-11-05

A fresh Lighthouse trace of the live Facebook-worker release measured 2.857 s simulated mobile LCP. Its observed breakdown was 461 ms TTFB, 656 ms resource load delay, 1,143 ms resource duration, and 12 ms render delay. The prior public PSI report `6d4j37egdg` showed 2.331 s simulated LCP and an observed 10 / 100 / 20 / 170 ms breakdown. Observed subparts are not the simulated LCP total and should not be added to explain that total. There is no demonstrated persistent JavaScript visibility gate; latency and render scheduling vary by environment.

The mobile image is already a 768px WebP (~18.8 KB), eager, high priority, and selected through an orientation-specific picture. Its first URL previously appeared at byte 118,282 of HTML, after the head and navigation. The new shared renderer emits matching responsive hints near the beginning of the head (mobile URL at byte 1,328). Both paths use BackgroundImage/CmsImage, preserving CDN URLs, quality, dimensions, art direction, decoding, and browser source selection. Existing body hints remain valid for standalone components; matching hints reuse one request.

Only a built-in page's first built-in section background is predicted. Custom slots/renderers, parallax and other first-block types, empty backgrounds, and breakpoint-hidden backgrounds are excluded. No tracking code, consent behavior, conversion handlers, or CMS scripts changed.

## Controlled comparison

Frozen production HTML, identical scripts and assets, gzip responses, actual Lighthouse mobile network throttling, alternating control/candidate order:

| Variant | Run | Resource load delay | Observed LCP | Render delay |
|---|---:|---:|---:|---:|
| Body hints | 1 | 129 ms | 1,774 ms | 17 ms |
| Head hints | 1 | 26 ms | 1,761 ms | 23 ms |
| Head hints | 2 | 25 ms | 1,746 ms | 10 ms |
| Body hints | 2 | 133 ms | 2,667 ms | 8 ms |

The reproducible benefit is ~104 ms earlier image discovery. The second control had a longer image-server response (1,963 ms versus 1,065 ms in its first sample), so its entire LCP difference cannot be attributed to this change. These are local diagnostic results, not PageSpeed scores or real-user data. Initial local experiments that did not compress proxied CSS were discarded as unrepresentative.

A separate inline-stylesheet experiment did not improve simulated mobile LCP (2.966 s inline versus 2.628 s external, one diagnostic pair), so CSS inlining was not shipped. It also sacrifices cross-page stylesheet caching. No claim of a repeatable CSS benefit is supported.

## Verification

- Five focused unit tests passed (first-section selection, override/hidden exclusions, alternative-only images, existing Storyblok URL behavior).
- Built Astro image audit passed on mobile and desktop: head contains only link hints, portrait hint matches image sources, one matching hero download, inactive orientation not fetched, card sizing and explicit decoding overrides preserved.
- Actual Upskill homepage built successfully with both GA/Facebook worker flags and two head image hints.
- GA worker and fallback tests passed (early lead, purchase, custom conversion, single config).
- Facebook worker, unsupported-browser fallback, and registration-failure fallback passed (two pixels, one page view, early lead, conversion payloads).
- Full shared `astro check` reports two existing errors in unchanged audit fixtures (`linked-card-audit` and `ui-regressions`), not in changed production components.

References: [Google LCP optimization](https://web.dev/articles/optimize-lcp), [Astro image guidance](https://docs.astro.build/en/guides/images/), [Astro stylesheet bundling](https://docs.astro.build/en/guides/styling/#production).
