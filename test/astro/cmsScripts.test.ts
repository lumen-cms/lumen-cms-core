// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { cmsScripts } from '../../packages/lumen-cms-shared/src/scripts'
import type { CmsScript } from '../../packages/lumen-cms-shared/src/scripts'
let initialize: () => void
let appended: HTMLScriptElement[]
beforeEach(async () => {
 vi.resetModules()
 initialize = (await import('../../packages/lumen-cms-astro/src/client/cmsScripts')).initializeCmsScripts
 appended = []
 vi.spyOn(document.body, 'append').mockImplementation((...nodes) => { appended.push(...nodes.filter(node => node instanceof HTMLScriptElement) as HTMLScriptElement[]) })
})
afterEach(() => { document.head.replaceChildren(); document.body.replaceChildren() })
const config = (entries: CmsScript[]) => {
 const script = document.createElement('script')
 script.type = 'application/json'; script.dataset.lmCmsScripts = ''; script.textContent = JSON.stringify(entries)
 document.head.append(script)
}
const entry = (id: string, changes: Partial<CmsScript> = {}): CmsScript => ({ id, strategy: 'afterInteractive', attributes: {}, body: 'window.fixture = true', ...changes })
it('preserves CMS IDs, timing, custom attributes and values containing equals signs', () => {
 expect(cmsScripts([{ component: 'script', _uid: 'uid', attributes: 'data-key=a=b, defer, crossorigin=anonymous', script_body: 'window.fixture = true' }])).toEqual([entry('uid', { attributes: { 'data-key': 'a=b', defer: '', crossorigin: 'anonymous' } })])
 expect(cmsScripts([{ component: 'script', _uid: 'uid', id: 'custom', url: '/fixture.js', script_body: 'ignored', strategy: 'beforeInteractive' }])[0]).toMatchObject({ id: 'custom', src: '/fixture.js', body: undefined, strategy: 'beforeInteractive' })
})
it('inserts interactive scripts once, with forwarded attributes and inline content', () => {
 config([entry('fixture', { attributes: { nonce: 'fixture-nonce', 'data-mode': 'test' } })])
 initialize(); initialize()
 expect(appended).toHaveLength(1)
 expect(appended[0].textContent).toBe('window.fixture = true')
 expect(appended[0].getAttribute('nonce')).toBe('fixture-nonce')
 expect(appended[0].dataset.mode).toBe('test')
})
it('deduplicates external URLs across different IDs and retries failed loads', () => {
 config([entry('first', { src: '/fixture.js' }), entry('second', { src: '/fixture.js' })])
 initialize()
 expect(appended).toHaveLength(1)
 appended[0].dispatchEvent(new Event('error'))
 initialize()
 expect(appended).toHaveLength(2)
})
it('does not reinsert server-rendered beforeInteractive scripts', () => {
 const before = document.createElement('script')
 before.type = 'application/json'; before.dataset.lmCmsScript = 'before'; document.head.append(before)
 config([entry('before')])
 initialize()
 expect(appended).toHaveLength(0)
})
it('waits for load and idle before adding lazy scripts', () => {
 vi.spyOn(document, 'readyState', 'get').mockReturnValue('loading')
 const idle = vi.fn()
 vi.stubGlobal('requestIdleCallback', idle)
 config([entry('lazy', { strategy: 'lazyOnload' })])
 initialize()
 expect(idle).not.toHaveBeenCalled()
 window.dispatchEvent(new Event('load'))
 expect(idle).toHaveBeenCalledTimes(1)
 expect(appended).toHaveLength(0)
 idle.mock.calls[0][0]()
 expect(appended).toHaveLength(1)
})
