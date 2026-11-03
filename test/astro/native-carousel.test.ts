// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { nativeCarousel } from '../../packages/lumen-cms-astro/src/client/nativeCarousel'
import { canUseNativeCarousel } from '../../packages/lumen-cms-astro/src/lib/nativeCarousel'
let media: EventTarget & { matches: boolean }
beforeEach(() => {
 vi.useFakeTimers()
 media = Object.assign(new EventTarget(), { matches: false })
 vi.stubGlobal('matchMedia', () => media)
 vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} })
 vi.spyOn(HTMLElement.prototype, 'scrollTo').mockImplementation(() => {})
})
afterEach(() => {
 document.dispatchEvent(new Event('astro:before-swap')); document.body.replaceChildren()
 vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals()
})
function fixture(options: Parameters<typeof nativeCarousel>[2] = {}, count = 3) {
 document.body.innerHTML = `<main><button data-carousel-pause>Pause slideshow</button><div>${Array.from({length:count}, (_, i) => `<section><input value="${i}"></section>`).join('')}</div></main>`
 const root = document.querySelector('main')!, viewport = root.querySelector('div')!, button = root.querySelector('button')!
 return { root, viewport, button, carousel: nativeCarousel(root, viewport, options) }
}
it('wraps legacy slides, clamps modern slides and excludes inactive content from focus', () => {
 const { carousel, viewport } = fixture({ loop: true })
 carousel.previous(); expect(carousel.index).toBe(2)
 expect((viewport.children[0] as HTMLElement).inert).toBe(true)
 expect((viewport.children[2] as HTMLElement).inert).toBe(false)
 carousel.next(); expect(carousel.index).toBe(0)
 carousel.destroy()
 const modern = fixture().carousel
 modern.previous(); expect(modern.index).toBe(0)
 modern.go(99); expect(modern.index).toBe(2)
})
it('autoplays through the last slide and pauses on hover, explicit pause and focus', () => {
 const { root, button, carousel } = fixture({ autoplay: 100, pauseOnHover: true })
 vi.advanceTimersByTime(300); expect(carousel.index).toBe(0)
 root.dispatchEvent(new Event('mouseenter')); vi.advanceTimersByTime(500); expect(carousel.index).toBe(0)
 root.dispatchEvent(new Event('mouseleave')); vi.advanceTimersByTime(100); expect(carousel.index).toBe(1)
 button.click(); vi.advanceTimersByTime(500); expect(carousel.index).toBe(1)
 button.click(); vi.advanceTimersByTime(100); expect(carousel.index).toBe(2)
 root.querySelector('input')!.dispatchEvent(new Event('focusin', { bubbles: true }))
 vi.advanceTimersByTime(500); expect(carousel.index).toBe(2)
})
it('stops modern autoplay on interaction but preserves legacy continuation', () => {
 const modern = fixture({ autoplay: 100, stopOnInteraction: true }).carousel
 modern.next(); vi.advanceTimersByTime(500); expect(modern.index).toBe(1)
 modern.destroy()
 const legacy = fixture({ autoplay: 100, loop: true }).carousel
 legacy.next(); vi.advanceTimersByTime(100); expect(legacy.index).toBe(2)
})
it('stops on reduced motion but permits explicit playback without animated scrolling', () => {
 const { carousel, button } = fixture({ autoplay: 100 })
 media.matches = true; media.dispatchEvent(new Event('change'))
 vi.advanceTimersByTime(1000); expect(carousel.index).toBe(0)
 button.click(); vi.advanceTimersByTime(100); expect(carousel.index).toBe(1)
 carousel.next(); expect(carousel.index).toBe(2)
 expect(HTMLElement.prototype.scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ behavior: 'instant' }))
})
it('disposes timers and controls on CMS unmount and handles empty/single slides', () => {
 const { root, carousel, button } = fixture({ autoplay: 100 })
 root.dispatchEvent(new CustomEvent('lumen:content-unmount', { bubbles: true }))
 button.click(); carousel.next(); vi.advanceTimersByTime(1000); expect(carousel.index).toBe(0)
 const single = fixture({ loop: true, autoplay: 100 }, 1).carousel
 single.next(); expect(single.index).toBe(0)
 const empty = fixture({ loop: true, autoplay: 100 }, 0).carousel
 empty.next(); expect(empty.index).toBe(0)
})
it('keeps advanced configurations on Swiper', () => {
 const base = { component: 'swiper' as const, _uid: 'a' }
 expect(canUseNativeCarousel(base)).toBe(true)
 expect(canUseNativeCarousel({ component: 'slider', _uid: 'a', slides_per_view: '1' })).toBe(true)
 for (const config of [{ effect: 'fade' }, { effect: 'cube' }, { property: ['free_mode'] }, { slides_per_view: '1,2,3' }, { slides_per_view: '1.5' }, { max_pagination_bullets: '3' }, { space_between_slides: '0,10' }]) {
  expect(canUseNativeCarousel({ ...base, ...config } as Parameters<typeof canUseNativeCarousel>[0])).toBe(false)
 }
})
