// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest'
import { onReducedMotion } from '../../packages/lumen-cms-astro/src/client/reducedMotion'
afterEach(() => { document.dispatchEvent(new Event('astro:before-swap')); document.body.replaceChildren(); vi.unstubAllGlobals() })
it('applies the preference initially and on changes, then detaches on removal', () => {
 const media = new EventTarget() as MediaQueryList & { matches: boolean }
 Object.defineProperty(media, 'matches', { value: true, writable: true })
 vi.stubGlobal('matchMedia', () => media)
 const root = document.createElement('div'); document.body.append(root)
 const stop = vi.fn()
 expect(onReducedMotion(root, stop)).toBe(true)
 expect(stop).toHaveBeenCalledTimes(1)
 media.matches = false; media.dispatchEvent(new Event('change'))
 expect(stop).toHaveBeenCalledTimes(1)
 media.matches = true; media.dispatchEvent(new Event('change'))
 expect(stop).toHaveBeenCalledTimes(2)
 root.dispatchEvent(new CustomEvent('lumen:content-unmount', { bubbles: true }))
 media.dispatchEvent(new Event('change'))
 expect(stop).toHaveBeenCalledTimes(2)
})
