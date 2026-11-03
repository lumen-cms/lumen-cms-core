import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { load } from 'cheerio'

const normalize = value => {
 try { return decodeURI(value).replace(/\/+$/, '') || '/' } catch { return value }
}
async function filesBelow(directory) {
 const entries = await readdir(directory, { withFileTypes: true })
 return (await Promise.all(entries.map(entry => entry.isDirectory() ? filesBelow(join(directory, entry.name)) : [join(directory, entry.name)]))).flat()
}

/** Check actual output, so generated pages, public assets and redirects count.
 * Never request external URLs or alter the rendered HTML. */
export async function auditLinks({ dir, site, base = '/', redirects = {}, knownPaths = [], strict = false, logger }) {
 const root = fileURLToPath(dir)
 const files = await filesBelow(root)
 const origin = site || 'https://lumen-build.invalid'
 const prefix = base.replace(/\/$/, '')
 const pathFor = file => `${prefix}/${relative(root, file).split('\\').join('/')}`
 const known = new Set([...knownPaths, ...Object.keys(redirects).map(path => `${prefix}${path}`)].map(normalize))
 for (const file of files) {
  const path = pathFor(file)
  known.add(normalize(path))
  if (path.endsWith('/index.html')) known.add(normalize(path.slice(0, -10)))
  else if (path.endsWith('.html')) known.add(normalize(path.slice(0, -5)))
 }
 const warnings = []
 for (const file of files.filter(file => file.endsWith('.html'))) {
  const source = pathFor(file).replace(/index\.html$/, '')
  const $ = load(await readFile(file, 'utf8'))
  $('template').remove()
  const pageUrl = new URL(source, origin)
  const seen = new Set()
  $('a[href]').each((_, element) => {
   const anchor = $(element)
   const href = anchor.attr('href')?.trim()
   if (!href || href.startsWith('#') || anchor.parents('template').length || anchor.attr('data-lm-action') || anchor.attr('data-lm-dialog-trigger')) return
   let target
   try { target = new URL(href, pageUrl) } catch { return }
   if (!['http:', 'https:'].includes(target.protocol) || target.origin !== pageUrl.origin) return
   const path = normalize(target.pathname)
   if (known.has(path) || seen.has(path)) return
   seen.add(path)
   const label = anchor.clone().find('style,script').remove().end().text().trim().replace(/\s+/g, ' ').slice(0, 100) || anchor.attr('aria-label') || '(unlabelled link)'
   warnings.push(`${source}: ${JSON.stringify(label)} → ${href} (no published destination)`)
  })
 }
 for (const message of warnings) logger.warn(`[links] ${message}`)
 if (strict && warnings.length) throw new Error(`[links] ${warnings.length} broken internal link(s). Set linkValidation: 'warn' to report without failing.`)
 return warnings
}

export function linkAuditHooks({ preview = false, linkValidation = process.env.LUMEN_LINK_VALIDATION || 'warn', knownLinkPaths = [] } = {}) {
 if (!['warn', 'error', 'off'].includes(linkValidation)) throw new Error('linkValidation must be warn, error, or off')
 let config
 return {
  'astro:config:setup': ({ updateConfig }) => {
   if (!preview) updateConfig({ prefetch: { prefetchAll: false, defaultStrategy: 'hover' } })
  },
  'astro:config:done': ({ config: resolved }) => { config = resolved },
  'astro:build:done': async ({ dir, logger }) => {
   if (preview || config.output !== 'static' || linkValidation === 'off') return
   // A sampled build intentionally omits valid pages. Absence is not evidence.
   if (process.env.LUMEN_SAMPLE_ROUTES) {
    logger.info('[links] Validation skipped for a partial LUMEN_SAMPLE_ROUTES build.')
    return
   }
   await auditLinks({ dir, site: config.site, base: config.base, redirects: config.redirects, knownPaths: knownLinkPaths, strict: linkValidation === 'error', logger })
  },
 }
}
