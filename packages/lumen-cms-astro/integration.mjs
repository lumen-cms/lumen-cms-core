import { linkAuditHooks } from './build/link-audit.mjs'
import { fileURLToPath } from 'node:url'
import { mdiIcons } from './build/mdi-icons.mjs'

/** Lumen build hooks and authenticated preview middleware.
 * SDK 11 component registration lives in src/lib/storyblok.ts. */
export default function lumenStoryblok({ preview = false, auth = process.env.LUMEN_AUTH_ENABLED === '1', linkValidation, knownLinkPaths } = {}) {
 const audit = linkAuditHooks({ preview, linkValidation, knownLinkPaths })
 const hooks = {}
 hooks['astro:config:setup'] = async options => {
  if (preview) {
   if (options.config.output !== 'server') throw new Error('Lumen live preview requires Astro server output')
   options.addMiddleware({ entrypoint: fileURLToPath(new URL('./src/server/storyblokPreviewMiddleware.ts', import.meta.url)), order: 'pre' })
  }
  if (auth && !preview) {
   if (!options.config.adapter) throw new Error('Lumen Auth requires a server adapter')
   options.injectRoute({ pattern: '/[...lumenAuthPath]', entrypoint: fileURLToPath(new URL('./src/components/AuthPage.astro', import.meta.url)), prerender: false })
   options.addMiddleware({ entrypoint: fileURLToPath(new URL('./src/server/authMiddleware.ts', import.meta.url)), order: 'pre' })
   for (const pattern of ['/auth/login', '/auth/signup', '/auth/callback', '/auth/logout', '/api/auth/session', '/api/account', '/refetch']) options.injectRoute({ pattern, entrypoint: fileURLToPath(new URL('./src/server/authRoutes.ts', import.meta.url)), prerender: false })
  }
  options.updateConfig({ vite: { plugins: [mdiIcons()] } })
 }
 for (const [name, hook] of Object.entries(audit)) {
  const original = hooks[name]
  hooks[name] = async options => { await original?.(options); await hook(options) }
 }
 return { name: 'lumen-storyblok', hooks }
}
