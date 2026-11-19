# Changelog

## 2.0.1 — 2026-11-19

- Require explicit `LUMEN_SPEED_INSIGHTS=true` or `1` in each website environment.
- Exclude the Speed Insights SDK and client entry from disabled and preview builds.
- Prevent consumer site settings from enabling collection implicitly.
- Document the opt-in switch and verify SDK presence/absence with real Astro builds.

## 2.0.0 — 2026-11-19

Start the unified Daisy/Astro release series at the repository tag `v2.0.0`.
Both `lumen-cms-astro` and `lumen-cms-shared` use version 2.0.0 and must be
installed from the same tagged commit. Future patch releases increment to
`v2.0.1`, `v2.0.2`, and so on. Published tags are immutable.

This release includes all fixes since Astro 0.3.0:

- Disable authentication and commerce in Storyblok previews.
- Remember dismissed snackbars for four hours.
- Constrain travel gallery images to their frames.
- Preserve trip booking facts when updating prices.

The preceding `lumen-cms-astro-v0.3.1` tag was published before the release naming
was changed; no websites were rolled out to it. Use `v2.0.0` for the unified rollout.
