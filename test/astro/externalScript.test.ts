// @vitest-environment happy-dom
import { beforeEach, expect, it, vi } from 'vitest'
import { loadExternalScript } from '../../packages/lumen-cms-astro/src/client/externalScript'

let inserted: HTMLScriptElement[]
beforeEach(() => { inserted = []; vi.spyOn(document.head, 'append').mockImplementation((...nodes) => { inserted.push(...nodes as HTMLScriptElement[]) }) })

it('shares a pending and loaded script across callers', async () => {
 const first = loadExternalScript('https://example.test/shared.js')
 const second = loadExternalScript('https://example.test/shared.js')
 expect(second).toBe(first)
 const scripts = inserted
 expect(scripts).toHaveLength(1)
 scripts[0].dispatchEvent(new Event('load'))
 await first
 expect(loadExternalScript('https://example.test/shared.js')).toBe(first)
})

it('removes failed scripts so a later mount can retry', async () => {
 const first = loadExternalScript('https://example.test/retry.js')
 const rejected = expect(first).rejects.toThrow('Unable to load')
 inserted.at(-1)!.dispatchEvent(new Event('error'))
 await rejected
 const second = loadExternalScript('https://example.test/retry.js')
 expect(second).not.toBe(first)
 inserted.at(-1)!.dispatchEvent(new Event('load'))
 await second
})
