import { defineConfig } from 'astro/config'
import { lumenImageConfig } from './src/images/config.mjs'
import tailwindcss from '@tailwindcss/vite'
import { runtimeAudit } from './build/runtime-audit.mjs'
import lumenStoryblok from './integration.mjs'

export default defineConfig({
  output: 'static',
  redirects: JSON.parse(process.env.LUMEN_LINK_REDIRECTS || '{}'),
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [lumenStoryblok()],
  publicDir: process.env.LUMEN_PUBLIC_DIR || '../../public',
  image: lumenImageConfig,
  site: process.env.LUMEN_SITE_URL,
  outDir: `./dist/${process.env.LUMEN_SITE || 'fixture'}`,
  vite: { plugins: [tailwindcss(), runtimeAudit()], ssr: { noExternal: ['lumen-cms-shared'] } },
})
