import { defineConfig } from 'astro/config'
import node from '@astrojs/node'
import base from './astro.config.mjs'
import lumenStoryblok from './integration.mjs'

// Public pages retain their independent static build. This service hosts APIs
// and the CMS preview routes, without changing public-page prerender behavior.
export default defineConfig({
 ...base,
 srcDir: './src-server',
 output: 'server',
 integrations: [lumenStoryblok({ preview: true })],
 adapter: node({ mode: 'standalone', bodySizeLimit: 1024 * 1024 }),
 // Existing API routes accept cross-origin form posts and apply their own CORS
 // whitelist. Astro's generic origin check otherwise rejects those before routing.
 security: { checkOrigin: false },
 session: { cookie: { name: 'lumen_preview', sameSite: 'none', secure: true, path: '/' } },
 outDir: `./dist/${process.env.LUMEN_SITE || 'fixture'}-server`,
})
