import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parseEnv } from 'node:util'
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import lumenStoryblok from './integration.mjs'
import { lumenImageConfig } from './src/images/config.mjs'
import { runtimeAudit } from './build/runtime-audit.mjs'
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
  process.env.LUMEN_LOCALES ??= locales.join(',')
  process.env.LUMEN_SITE_URL ??= site
  const siteUrl = URL.parse(process.env.LUMEN_SITE_URL || '')
  if (!siteUrl || !['http:', 'https:'].includes(siteUrl.protocol)) throw new Error('LUMEN_SITE_URL must be an absolute HTTP(S) URL')
  process.env.SITEMAP_HOSTNAME ??= siteUrl.host
  process.env.LUMEN_PUBLIC_DIR ??= resolve('public')
  if (rootDirectory) process.env.PUBLIC_ROOT_DIRECTORY ??= rootDirectory
  // These are public, build-time routing defaults, not credentials. Vercel's
  // functions do not inherit values assigned to process.env during the build.
  const routingDefaults = ['LUMEN_LOCALES', 'LUMEN_SITE_URL', 'SITEMAP_HOSTNAME', 'SITEMAP_LOCALE', 'TRAVELS_SLUG', ...Object.keys(process.env).filter(key => key.startsWith('PUBLIC_'))]
  return defineConfig({
    site: process.env.LUMEN_SITE_URL,
    output: 'server',
    adapter,
    integrations: [lumenStoryblok({ preview: true }), localeErrorRouting()],
    image: lumenImageConfig,
    vite: {
      define: Object.fromEntries(routingDefaults.filter(key => process.env[key] !== undefined).map(key => [`process.env.${key}`, JSON.stringify(process.env[key])])),
      plugins: [tailwindcss(), runtimeAudit()],
      ssr: { noExternal: ['lumen-cms-astro', 'lumen-cms-shared'] },
    },
    ...options,
  })
}
