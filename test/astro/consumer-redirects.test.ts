import { expect, it } from 'vitest'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createRequire } from 'node:module'
const { consumerRedirects } = createRequire(import.meta.url)('../../scripts/consumer-redirects.cjs')
it('imports exact locale-independent redirects without treating Next patterns as static routes', () => {
 const dir = mkdtempSync(join(tmpdir(), 'lumen-redirects-'))
 try {
  expect(consumerRedirects(dir)).toEqual({})
  writeFileSync(join(dir, 'redirects.js'), `module.exports = { urls: [
   { source: '/hilfe', destination: '/de/hilfe', permanent: true, locale: false },
   { source: '/temporary', destination: '/new', locale: false },
   { source: '/:slug*', destination: '/de/:slug*', permanent: true, locale: false },
   { source: '/localized', destination: '/new', permanent: true },
  ] }`)
  expect(consumerRedirects(dir)).toEqual({ '/hilfe': { destination: '/de/hilfe', status: 308 }, '/temporary': { destination: '/new', status: 307 } })
 } finally { rmSync(dir, { recursive: true, force: true }) }
})
