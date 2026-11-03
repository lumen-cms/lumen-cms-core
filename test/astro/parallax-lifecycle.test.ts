// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest'
import { initializeParallax } from '../../packages/lumen-cms-astro/src/client/parallax'
const { init, controllers } = vi.hoisted(() => {
 const controllers: Array<{ createElement: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn>; destroy: ReturnType<typeof vi.fn> }> = []
 return { controllers, init: vi.fn(() => {
  const controller = { createElement: vi.fn(), update: vi.fn(), destroy: vi.fn() }
  controllers.push(controller)
  return controller
 }) }
})
vi.mock('../../packages/lumen-cms-astro/src/client/parallaxRuntime', () => ({ ParallaxController: { init } }))
afterEach(() => {
 document.dispatchEvent(new Event('astro:before-swap'))
 document.body.replaceChildren()
 controllers.length = 0
 vi.clearAllMocks(); vi.restoreAllMocks(); vi.unstubAllGlobals()
})
function root() {
 const element = document.createElement('div')
 element.dataset.lmParallax = 'pending'
 element.innerHTML = '<div class="lm-parallax-banner"><div data-parallax-layer=\'{"speed":-20}\'><img /></div></div>'
 document.body.append(element)
 return element
}
it('disposes only the removed section and its image listeners', async () => {
 const first = root(); const second = root()
 initializeParallax(); initializeParallax()
 await vi.dynamicImportSettled()
 expect(init).toHaveBeenCalledTimes(2)
 expect(controllers[0].createElement).toHaveBeenCalledTimes(1)
 first.dispatchEvent(new CustomEvent('lumen:content-unmount', { bubbles: true }))
 expect(controllers[0].destroy).toHaveBeenCalledTimes(1)
 expect(controllers[1].destroy).not.toHaveBeenCalled()
 first.querySelector('img')!.dispatchEvent(new Event('load'))
 expect(controllers[0].update).toHaveBeenCalledTimes(1)
 expect(second.dataset.lmParallax).toBe('active')
})
it('observes a pending section once and ignores callbacks after removal', () => {
 let callback: IntersectionObserverCallback
 const observe = vi.fn(); const disconnect = vi.fn()
 vi.stubGlobal('IntersectionObserver', class {
  constructor(cb: IntersectionObserverCallback) { callback = cb }
  observe = observe; disconnect = disconnect
 })
 const element = root()
 vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({ top: 100000, bottom: 100100, left: 0, right: 100 } as DOMRect)
 initializeParallax(); initializeParallax()
 expect(observe).toHaveBeenCalledTimes(1)
 element.dispatchEvent(new CustomEvent('lumen:content-unmount', { bubbles: true }))
 callback!([{ target: element, isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)
 expect(disconnect).toHaveBeenCalledTimes(1)
 expect(init).not.toHaveBeenCalled()
})
it('registers nested section layers only with their own controller', async () => {
 const parent = root(); const child = root()
 parent.querySelector('.lm-parallax-banner')!.append(child)
 initializeParallax()
 await vi.dynamicImportSettled()
 expect(init).toHaveBeenCalledTimes(2)
 controllers.forEach(controller => expect(controller.createElement).toHaveBeenCalledTimes(1))
})
it('keeps reduced-motion sections static without initializing a controller', async () => {
 vi.stubGlobal('matchMedia', () => Object.assign(new EventTarget(), { matches: true }))
 const element = root()
 initializeParallax(); await vi.dynamicImportSettled()
 expect(element.dataset.lmParallax).toBe('static')
 expect(init).not.toHaveBeenCalled()
})
