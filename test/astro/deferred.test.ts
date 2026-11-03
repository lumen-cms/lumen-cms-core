// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { initializeDeferred } from '../../packages/lumen-cms-astro/src/client/deferred'
let intersect: IntersectionObserverCallback
const disconnect = vi.fn()
const flush = async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve() }
beforeEach(() => {
 vi.stubGlobal('IntersectionObserver', class { constructor(callback: IntersectionObserverCallback) { intersect = callback } observe() {} disconnect = disconnect })
 document.body.innerHTML = '<section data-test><button>Control</button></section>'
 vi.spyOn(document.querySelector('section')!, 'getBoundingClientRect').mockReturnValue({ top: 90000, bottom: 90500, left: 0, right: 400 } as DOMRect)
})
afterEach(() => { document.dispatchEvent(new Event('astro:before-swap')); document.body.replaceChildren(); vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.clearAllMocks() })
const reveal = () => intersect([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)
it('loads once on visibility and disposes and remounts on CMS replacement', async () => {
 const dispose = vi.fn(), mount = vi.fn(() => dispose), load = vi.fn(async () => ({ mount }))
 initializeDeferred('[data-test]', load); initializeDeferred('[data-test]', load)
 expect(load).not.toHaveBeenCalled()
 reveal(); reveal(); await flush()
 expect(load).toHaveBeenCalledOnce(); expect(mount).toHaveBeenCalledOnce()
 const root = document.querySelector<HTMLElement>('section')!
 expect(root.dataset.deferredState).toBe('ready')
 root.dispatchEvent(new CustomEvent('lumen:content-unmount', { bubbles: true }))
 expect(dispose).toHaveBeenCalledOnce()
 initializeDeferred('[data-test]', load); reveal(); await flush(); expect(mount).toHaveBeenCalledTimes(2)
})
it('does not mount if removed during import', async () => {
 let finish!: (module: { mount: ReturnType<typeof vi.fn> }) => void
 const mount = vi.fn(), load = vi.fn(() => new Promise<{ mount: typeof mount }>(resolve => { finish = resolve }))
 initializeDeferred('[data-test]', load); reveal()
 document.dispatchEvent(new Event('astro:before-swap')); finish({ mount }); await flush()
 expect(mount).not.toHaveBeenCalled()
})
it('cleans up an asynchronous mount that completes after unmount', async () => {
 let finish!: (dispose: () => void) => void
 const dispose = vi.fn()
 initializeDeferred('[data-test]', async () => ({ mount: () => new Promise(resolve => { finish = resolve }) }))
 reveal(); await flush(); document.dispatchEvent(new Event('astro:before-swap')); finish(dispose); await flush()
 expect(dispose).toHaveBeenCalledOnce()
})
it('supports keyboard activation and a visible retry after import failure', async () => {
 const load = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue({ mount: vi.fn() })
 initializeDeferred('[data-test]', load)
 document.querySelector('button')!.focus(); await flush()
 expect(document.querySelector('[role=alert]')).not.toBeNull()
 ;(document.querySelector('[role=alert] button') as HTMLButtonElement).click(); await flush()
 expect(load).toHaveBeenCalledTimes(2)
 expect(document.querySelector('[role=alert]')).toBeNull()
 expect(document.querySelector<HTMLElement>('section')!.dataset.deferredState).toBe('ready')
})
