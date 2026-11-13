import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parseEnv } from 'node:util'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'astro/config'
import partytown from '@astrojs/partytown'
import { trackingWorkerConfig, facebookScriptProxy } from './build/tracking-workers.mjs'
import tailwindcss from '@tailwindcss/vite'
import lumenStoryblok from './integration.mjs'
import { lumenImageConfig } from './src/images/config.mjs'
import { runtimeAudit } from './build/runtime-audit.mjs'
import { discovery } from './build/discovery.mjs'
import { localeErrorRouting } from './build/error-routing.mjs'

/** Load consumer settings before the delivery modules evaluate CONFIG. */
export function defineLumenConfig({ site, locales = ['en'], rootDirectory, environment: defaults = {}, adapter, ...options }) {
  const environment = {}
  for (const name of ['.env', '.env.local']) {
    try { Object.assign(environment, parseEnv(readFileSync(resolve(name), 'utf8'))) }
    catch (error) { if (error.code !== 'ENOENT') throw error }
  }
  for (const [name, value] of Object.entries(environment)) process.env[name] ??= value
  for (const [name, value] of Object.entries(defaults)) process.env[name] ??= value
  process.env.PUBLIC_FACEBOOK_WORKER ??= '1'
  const facebookWorker = process.env.PUBLIC_FACEBOOK_WORKER === '1'
  const googleWorker = !process.env.PUBLIC_GTM_CONTAINER?.trim()
  const target = process.env.TARGET
  if (target && !['SSG', 'SSR'].includes(target)) throw new Error('TARGET must be SSG or SSR')
  const buildMode = target ? (target === 'SSG' ? 'public' : 'preview') : process.env.LUMEN_BUILD_MODE || 'preview'
  if (!['public', 'preview'].includes(buildMode)) throw new Error('LUMEN_BUILD_MODE must be public or preview')
  if (buildMode === 'public' && process.env.LUMEN_SAMPLE_ROUTES) throw new Error('Public builds cannot use LUMEN_SAMPLE_ROUTES')
  process.env.LUMEN_BUILD_MODE = buildMode
  // Freeze collection settings into SSR builds too; default to disabled.
  process.env.LUMEN_SPEED_INSIGHTS ??= '0'
  process.env.LUMEN_SPEED_INSIGHTS_SAMPLE_RATE ??= '0.1'
  process.env.LUMEN_LOCALES ??= locales.join(',')
  process.env.LUMEN_SITE_URL ??= site
  const siteUrl = URL.parse(process.env.LUMEN_SITE_URL || '')
  if (!siteUrl || !['http:', 'https:'].includes(siteUrl.protocol)) throw new Error('LUMEN_SITE_URL must be an absolute HTTP(S) URL')
  process.env.SITEMAP_HOSTNAME ??= siteUrl.host
  process.env.LUMEN_PUBLIC_DIR ??= resolve('public')
  if (rootDirectory) process.env.PUBLIC_ROOT_DIRECTORY ??= rootDirectory
  // These are public, build-time routing defaults, not credentials. Vercel's
  // functions do not inherit values assigned to process.env during the build.
  const routingDefaults = ['VERCEL_ENV', 'LUMEN_SPEED_INSIGHTS', 'LUMEN_SPEED_INSIGHTS_SAMPLE_RATE', 'LUMEN_BUILD_MODE', 'LUMEN_AUTH_ENABLED', 'LUMEN_LOCALES', 'LUMEN_SITE_URL', 'SITEMAP_HOSTNAME', 'SITEMAP_LOCALE', 'TRAVELS_SLUG', ...Object.keys(process.env).filter(key => key.startsWith('PUBLIC_'))]
  return defineConfig({
    site: process.env.LUMEN_SITE_URL,
    output: buildMode === 'public' ? 'static' : 'server',
    adapter,
    integrations: [...(googleWorker || facebookWorker ? [partytown({ config: trackingWorkerConfig({ google: googleWorker, facebook: facebookWorker }) })] : []), ...(facebookWorker ? [facebookScriptProxy()] : []), lumenStoryblok({ preview: buildMode === 'preview' }), localeErrorRouting(), discovery({ preview: buildMode === 'preview' })],
    image: buildMode === 'public' ? {
      ...lumenImageConfig,
      service: {
        build: { entrypoint: fileURLToPath(new URL('./src/images/runtime-url-service.ts', import.meta.url)) },
        runtime: lumenImageConfig.service,
      },
    } : lumenImageConfig,
    vite: {
      define: Object.fromEntries(routingDefaults.filter(key => process.env[key] !== undefined).map(key => [`process.env.${key}`, JSON.stringify(process.env[key])])),
      plugins: [tailwindcss(), runtimeAudit()],
      ssr: { noExternal: ['lumen-cms-astro', 'lumen-cms-shared'] },
    },
    ...options,
  })
}
