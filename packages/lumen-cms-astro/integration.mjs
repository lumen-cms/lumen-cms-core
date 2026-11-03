import { linkAuditHooks } from './build/link-audit.mjs'
import { fileURLToPath } from 'node:url'
import { storyblok } from '@storyblok/astro'
import { componentRegistryOptions } from './src/lib/componentRegistry.mjs'
import { mdiIcons } from './build/mdi-icons.mjs'

/** The same SDK registry for consumers, static builds, and authenticated SSR
 * previews. Components resolve from this package, not the consumer's src dir. */
export default function lumenStoryblok({ preview = false, linkValidation, knownLinkPaths } = {}) {
 const sdk = storyblok({
  ...componentRegistryOptions,
  componentsDir: fileURLToPath(new URL('./src', import.meta.url)),
  useCustomApi: true,
  // Lumen owns one Bridge subscription so input can paint before the SDK's
  // debounced handler. Retain the official preview middleware below.
  livePreview: false,
  bridge: false,
 })
 const audit = linkAuditHooks({ preview, linkValidation, knownLinkPaths })
 const hooks = { ...sdk.hooks }
 const setup = hooks['astro:config:setup']
 hooks['astro:config:setup'] = async options => {
  if (preview) {
   if (options.config.output !== 'server') throw new Error('Lumen live preview requires Astro server output')
   options.addMiddleware({ entrypoint: '@storyblok/astro/middleware.ts', order: 'pre' })
  }
  await setup?.(options)
  options.updateConfig({ vite: { plugins: [mdiIcons()] } })
 }
 for (const [name, hook] of Object.entries(audit)) {
  const original = hooks[name]
  hooks[name] = async options => { await original?.(options); await hook(options) }
 }
 return { ...sdk, hooks }
}
