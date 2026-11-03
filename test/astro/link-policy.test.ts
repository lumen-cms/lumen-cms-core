import { describe, expect, it, vi } from 'vitest'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { getLinkAttrs } from '../../packages/lumen-cms-astro/src/lib/links'
import { hoverPrefetch } from '../../packages/lumen-cms-astro/src/lib/linkPrefetch'
import { auditLinks, linkAuditHooks } from '../../packages/lumen-cms-astro/build/link-audit.mjs'

describe('Storyblok link policy', () => {
 it('uses the UUID inventory over a stale resolved story and retains query, anchor and target', () => {
  const page = { locales: ['en', 'de'], defaultLocale: 'en', storyLinkIndex: { uuid: 'de/renamed' } }
  expect(getLinkAttrs({ id: 'uuid', linktype: 'story', cached_url: 'old?ref=nav', anchor: 'details', story: { uuid: 'uuid', full_slug: 'old', url: 'old', name: 'Old', slug: 'old', id: 1 } }, { openExternal: true }, page)).toMatchObject({ href: '/de/renamed?ref=nav#details', target: '_blank' })
  expect(getLinkAttrs({ id: 'deleted', linktype: 'story', cached_url: 'old' }, {}, page).href).toBe('/old')
  expect(getLinkAttrs({ id: 'uuid', linktype: 'story' }, {}, page).href).toBe('/de/renamed')
 })
 it('prefetches eligible internal destinations and respects opt-outs', () => {
  const current = new URL('https://example.com/current')
  expect(hoverPrefetch({ href: '/next' }, current)).toBe('hover')
  expect(hoverPrefetch({ href: 'https://example.com/next' }, current)).toBe('hover')
  for (const attrs of [{ href: '#section' }, { href: '/current#section' }, { href: '?q=1' }, { href: 'https://other.com/next' }, { href: 'mailto:a@b.com' }, { href: '/next', target: '_blank' }, { href: '/next', download: '' }, { href: '/next', 'data-lm-action': 'submit' }, { href: '/next', 'data-astro-prefetch': 'false' }]) {
   expect(hoverPrefetch(attrs, current)).toBeUndefined()
  }
  expect(hoverPrefetch({ href: '/next' }, current, undefined, true)).toBeUndefined()
 })
 it('reports missing output without removing links; strict mode fails', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'lumen-links-'))
  try {
   await mkdir(join(directory, 'about'))
   await writeFile(join(directory, 'about/index.html'), '<a href="../missing?x=1#section">Gone</a>')
   const html = '<a href="/about#section">About</a><a href="/old">Redirect</a><a href="/runtime">Runtime</a><a href="/file.pdf" download>File</a><a href="https://other.com/missing">External</a><a href="mailto:a@b.com">Email</a><a href="#section">Anchor</a><template><a href="__LM_RICH_HREF__">Template</a></template><a href="/gone">Gone</a><a href="/gone#x">Gone again</a>'
   await writeFile(join(directory, 'index.html'), html)
   await writeFile(join(directory, 'file.pdf'), 'fixture')
   const logger = { warn: vi.fn() }
   const options = { dir: pathToFileURL(directory + '/'), site: 'https://example.com', redirects: { '/old': '/about' }, knownPaths: ['/runtime'], logger }
   const warnings = await auditLinks(options)
   expect(warnings).toHaveLength(2)
   expect(warnings.join('\n')).toContain('/gone')
   expect(warnings.join('\n')).toContain('../missing?x=1#section')
   const { readFile } = await import('node:fs/promises')
   expect(await readFile(join(directory, 'index.html'), 'utf8')).toBe(html)
   await expect(auditLinks({ ...options, strict: true })).rejects.toThrow('2 broken internal link(s)')
  } finally { await rm(directory, { recursive: true, force: true }) }
 })
 it('skips validation for partial builds', async () => {
  vi.stubEnv('LUMEN_SAMPLE_ROUTES', '["about"]')
  try {
   const hooks = linkAuditHooks({ linkValidation: 'error' })
   hooks['astro:config:done']({ config: { output: 'static' } })
   const logger = { info: vi.fn() }
   await hooks['astro:build:done']({ logger })
   expect(logger.info).toHaveBeenCalled()
  } finally { vi.unstubAllEnvs() }
 })
})

it('preserves German folders with Planet’s dormant suppression flag', () => {
 vi.stubEnv('NEXT_PUBLIC_SUPPRESS_SLUG_LOCALE', 'true')
 vi.stubEnv('NEXT_PUBLIC_LANGUAGES', '')
 try {
  expect(getLinkAttrs({ linktype: 'story', cached_url: 'de/hilfe/trainingsverwaltung' }, {}, { locales: ['en', 'de'], defaultLocale: 'en' }).href).toBe('/de/hilfe/trainingsverwaltung')
 } finally { vi.unstubAllEnvs() }
})
it('repairs legacy CMS paths only through explicit redirects, including absolute same-origin URLs', () => {
 vi.stubEnv('LUMEN_SITE_URL', 'https://planet.training')
 vi.stubEnv('LUMEN_LINK_REDIRECTS', JSON.stringify({ '/hilfe/trainingsverwaltung': { destination: '/de/hilfe/trainingsverwaltung', status: 308 }, '/old': '/hilfe/trainingsverwaltung', '/cycle-a': '/cycle-b', '/cycle-b': '/cycle-a' }))
 try {
  const page = { locales: ['en', 'de'], defaultLocale: 'en' }
  expect(getLinkAttrs({ linktype: 'story', cached_url: '/hilfe/trainingsverwaltung?source=nav', anchor: 'details' }, {}, page).href).toBe('/de/hilfe/trainingsverwaltung?source=nav#details')
  expect(getLinkAttrs({ linktype: 'url', cached_url: 'https://planet.training/hilfe/trainingsverwaltung?source=blog#top' }, { openExternal: true }, page)).toMatchObject({ href: 'https://planet.training/de/hilfe/trainingsverwaltung?source=blog#top', target: '_blank' })
  expect(getLinkAttrs({ linktype: 'story', cached_url: '/old' }, {}, page).href).toBe('/de/hilfe/trainingsverwaltung')
  expect(getLinkAttrs({ linktype: 'story', cached_url: '/cycle-a' }, {}, page).href).toBe('/cycle-a')
  expect(getLinkAttrs({ linktype: 'story', cached_url: '/unknown' }, {}, page).href).toBe('/unknown')
  expect(getLinkAttrs({ linktype: 'url', cached_url: 'https://other.test/hilfe/trainingsverwaltung' }, {}, page).href).toBe('https://other.test/hilfe/trainingsverwaltung')
 } finally { vi.unstubAllEnvs() }
})
