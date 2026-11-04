# Shared image proxy

This directory is deployed as the standalone Vercel project `websites-astro-image-proxy` in the `lumenmedia` team (framework: Other), at the fixed domain `https://img-prxy.lumen.media`. Its function runs in Frankfurt (`fra1`). No database or generated Blob storage is used.

Set a cryptographically random `IMAGE_PROXY_SECRET` (at least 32 bytes) on the proxy and on each consuming site's build and runtime environments. Do not prefix this secret with `PUBLIC_`. The Astro component defaults to `https://img-prxy.lumen.media`; `PUBLIC_IMAGE_PROXY_URL` is an optional origin override. Rotating the secret changes generated URLs; coordinate rotation across projects.

The server-side Astro component signs deterministic `/api/image` URLs containing the full source URL, width, optional height, quality, format, fit, position and transformation version. Arbitrary public HTTP(S) sources are supported. DNS is validated and pinned for each request and redirect; credentials, nonstandard ports and private destinations are rejected. The source must be publicly accessible without cookies or authorization. Sources are considered immutable: use a new source URL or transformation version to refresh an image.

Successful responses request one year of browser and Vercel CDN caching. Errors are never cached. CDN eviction and deployment of this proxy can cause regeneration; deploying consumer websites does not invalidate this project's cache. Identical concurrent misses are coalesced within a function instance, not globally.

AVIF and WebP picture sources let browsers choose supported formats with PNG fallback preserving transparency. GIF/WebP sources use an animation-preserving WebP path. The proxy preserves animation as WebP if an unexpected animated source is requested in a still-only format. SVG and ICO sources are bypassed by the component and rejected by the transformer. Storyblok keeps its existing CDN behavior (including the existing local Sharp fallback for explicit transforms). Local site assets retain the site's own image pipeline.

Limits: 4096 pixels per requested dimension, 40 million decoded pixels, 20 MiB source, 4 MiB output, four redirects, 15-second source timeout. For arbitrary domains without supplied dimensions, non-fill images probe a signed proxy variant for their aspect ratio. Supply dimensions where available to avoid that extra build/runtime request.

Run `npm ci` and `npm test` from this directory. Deploy with `vercel --prod`, with this directory selected as the project root. After setting the shared secret, request a signed image twice and check for `x-vercel-cache: HIT`, correct content type, and the browser cache header. Vercel consumes the CDN-specific header rather than forwarding it to browsers.
