import type { ScriptStoryblok } from 'lumen-cms-shared/core/typings/generated/components-schema'
export interface CmsScript {
 id: string
 src?: string
 body?: string
 strategy: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload'
 attributes: Record<string, string>
}
export function cmsScripts(scripts: ScriptStoryblok[] = []): CmsScript[] {
 return scripts.map(script => ({
  id: script.id || script._uid, src: script.url || undefined,
  body: script.url ? undefined : script.script_body || '',
  strategy: script.strategy || 'afterInteractive',
  attributes: Object.fromEntries((script.attributes || '').split(',').map(value => value.trim()).filter(Boolean).map(attribute => {
   const separator = attribute.indexOf('=')
   return separator < 0 ? [attribute, ''] : [attribute.slice(0, separator).trim(), attribute.slice(separator + 1)]
  })),
 }))
}
