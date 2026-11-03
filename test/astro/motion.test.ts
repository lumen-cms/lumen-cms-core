// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest'
import { initializeMotion } from '../../packages/lumen-cms-astro/src/client/motion'

afterEach(() => {
 document.dispatchEvent(new Event('astro:before-swap'))
 document.body.replaceChildren()
 vi.useRealTimers()
 vi.unstubAllGlobals()
})

function setup(threshold = '75', delay = '100') {
 vi.useFakeTimers()
 let callback: IntersectionObserverCallback
 let options: IntersectionObserverInit | undefined
 const disconnect = vi.fn()
 vi.stubGlobal('IntersectionObserver', class {
  constructor(cb: IntersectionObserverCallback, opts: IntersectionObserverInit) { callback = cb; options = opts }
  observe() {}
  disconnect = disconnect
 })
 document.body.innerHTML = `<div data-lm-motion="fade" data-motion-state="pending" data-motion-threshold="${threshold}" data-motion-delay="${delay}"><div class="lm-motion__transition">Content</div></div>`
 const root = document.body.firstElementChild as HTMLElement
 const child = root.firstElementChild as HTMLElement
 const animate = vi.fn(() => ({ finished: Promise.resolve() }))
 child.animate = animate as unknown as typeof child.animate
 child.getAnimations = () => []
 initializeMotion()
 const enter = (intersectionRatio: number, isIntersecting = true) => callback([{ intersectionRatio, isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver)
 return { root, animate, enter, disconnect, options }
}

it('waits for the CMS visibility percentage, then animates once after its delay', async () => {
 const { root, animate, enter, disconnect, options } = setup()
 expect(options?.threshold).toBe(.75)
 enter(.1)
 await vi.advanceTimersByTimeAsync(200)
 expect(animate).not.toHaveBeenCalled()
 enter(.75)
 await vi.advanceTimersByTimeAsync(99)
 expect(animate).not.toHaveBeenCalled()
 await vi.advanceTimersByTimeAsync(1)
 expect(animate).toHaveBeenCalledTimes(1)
 expect(root.dataset.motionState).toBe('complete')
 expect(disconnect).toHaveBeenCalled()
 enter(1)
 await vi.advanceTimersByTimeAsync(200)
 expect(animate).toHaveBeenCalledTimes(1)
})

it('cancels the pending delay when visibility falls below the threshold', async () => {
 const { animate, enter } = setup()
 enter(.8)
 await vi.advanceTimersByTimeAsync(50)
 enter(.7)
 await vi.advanceTimersByTimeAsync(100)
 expect(animate).not.toHaveBeenCalled()
 enter(.8)
 await vi.advanceTimersByTimeAsync(100)
 expect(animate).toHaveBeenCalledTimes(1)
})

it('disposes pending animations when CMS content is unmounted', async () => {
 const { animate, enter, root, disconnect } = setup()
 enter(1)
 root.dispatchEvent(new CustomEvent('lumen:content-unmount', { bubbles: true }))
 await vi.advanceTimersByTimeAsync(200)
 expect(animate).not.toHaveBeenCalled()
 expect(disconnect).toHaveBeenCalled()
})
