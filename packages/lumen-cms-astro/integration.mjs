import { linkAuditHooks } from './build/link-audit.mjs'
import { fileURLToPath } from 'node:url'
import { storyblok } from '@storyblok/astro'
import { componentRegistryOptions } from './src/lib/componentRegistry.mjs'

/** The same SDK registry for consumers, static builds, and authenticated SSR
 * previews. Components resolve from this package, not the consumer's src dir. */
export default function lumenStoryblok({ preview = false, linkValidation, knownLinkPaths } = {}) {
 const sdk = storyblok({
  ...componentRegistryOptions,
  componentsDir: fileURLToPath(new URL('./src', import.meta.url)),
  useCustomApi: true,
  livePreview: preview,
  bridge: preview ? {
   resolveLinks: 'url',
   // Keep aligned with the delivery API's defaultResolveRelations.
   resolveRelations: ['static_section.container', 'form_container.form', 'event.category', 'news.category', 'page.categories'],
  } : false,
 })
 const audit = linkAuditHooks({ preview, linkValidation, knownLinkPaths })
 const hooks = { ...sdk.hooks }
 for (const [name, hook] of Object.entries(audit)) {
  const original = hooks[name]
  hooks[name] = async options => { await original?.(options); await hook(options) }
 }
 return { ...sdk, hooks }
}
