import type { RenderContext } from './context'
import { getLinkAttrs as resolveLink, internalLinkHandler as resolveInternalLink, type LinkConfig, type LinkOptions, type LinkType } from 'lumen-cms-shared/links'
export { isValidLink } from 'lumen-cms-shared/links'
export type { LinkType } from 'lumen-cms-shared/links'

let redirects: ReadonlyMap<string, string> = new Map()
/** Register the consumer's exact legacy link replacements once during setup. */
export function configureLinkRedirects(entries: Iterable<readonly [string, string]>) {
 redirects = new Map(entries)
}

let redirectEnvironment: string | undefined
let environmentRedirects = new Map<string, string>()
function redirectMap() {
 const source = process.env.LUMEN_LINK_REDIRECTS || '{}'
 if (source !== redirectEnvironment) {
  const rules = JSON.parse(source) as Record<string, string | { destination: string }>
  environmentRedirects = new Map(Object.entries(rules).map(([path, rule]) => [path, typeof rule === 'string' ? rule : rule.destination]))
  redirectEnvironment = source
 }
 return new Map([...environmentRedirects, ...redirects])
}

/** Follow only explicit consumer mappings, retaining authored query/fragment.
 * Same-origin absolute URLs can also be old CMS links; external URLs stay put. */
export function resolveLinkRedirect(href: string): string {
 const origin = process.env.LUMEN_SITE_URL || 'https://lumen.invalid'
 let url: URL
 try { url = new URL(href, origin) } catch { return href }
 if (url.origin !== new URL(origin).origin || !['http:', 'https:'].includes(url.protocol) || href.startsWith('#') || href.startsWith('?')) return href
 const rules = redirectMap()
 const seen = new Set<string>()
 let changed = false
 while (rules.has(url.pathname)) {
  if (seen.has(url.pathname)) return href // Keep cyclic configuration visible to the build audit.
  seen.add(url.pathname)
  const destination = new URL(rules.get(url.pathname)!, origin)
  if (!destination.search) destination.search = url.search
  if (!destination.hash) destination.hash = url.hash
  url = destination
  changed = true
  if (url.origin !== new URL(origin).origin) break
 }
 if (!changed) return href
 return /^https?:\/\//.test(href) || url.origin !== new URL(origin).origin ? url.href : url.pathname + url.search + url.hash
}

// Read only the routing settings required for links, not the legacy renderer's
// component registry or CMS credentials. Resolve at call time for server use.
type PageLocales = Pick<RenderContext['page'], 'locales' | 'defaultLocale' | 'storyLinkIndex'>
function linkConfig(page?: PageLocales): LinkConfig {
 const locales = page?.locales?.length ? page.locales : (process.env.LUMEN_LOCALES || 'en,de').split(',')
 return {
  publicRoutes: { locales, defaultLocale: page?.defaultLocale || locales[0] },
  rootDirectory: process.env.NEXT_PUBLIC_ROOT_DIRECTORY,
  suppressSlugLocale: !!process.env.NEXT_PUBLIC_SUPPRESS_SLUG_LOCALE,
  languages: process.env.NEXT_PUBLIC_LANGUAGES?.split(',') || [],
  fieldLevelTranslation: !!process.env.NEXT_PUBLIC_FIELD_LEVEL_TRANSLATION
 }
}
export function getLinkAttrs(link: LinkType = {}, options: LinkOptions = {}, page?: PageLocales) {
 const uuid = link.id || link.story?.uuid
 const slug = link.linktype === 'story' && uuid ? page?.storyLinkIndex?.[uuid] : undefined
 if (slug) {
  const cached = link.cached_url || ''
  const suffix = cached.search(/[?#]/)
  // The inventory is authoritative for the UUID; keep authored query/fragment.
  link = { ...link, story: undefined, cached_url: slug + (suffix < 0 ? '' : cached.slice(suffix)) }
 }
 const attrs = resolveLink(link, options, linkConfig(page))
 if (attrs.href && link.linktype !== 'asset' && link.linktype !== 'email') attrs.href = resolveLinkRedirect(attrs.href)
 return attrs
}
export function internalLinkHandler(url: string, page?: PageLocales) {
 return resolveLinkRedirect(resolveInternalLink(url, linkConfig(page)))
}
