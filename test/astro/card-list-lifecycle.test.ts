// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { initializeCardLists } from '../../packages/lumen-cms-astro/src/client/cardList'
const observers: Array<{ callback: IntersectionObserverCallback; observe: ReturnType<typeof vi.fn>; unobserve: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn> }> = []
beforeEach(() => {
 vi.stubGlobal('IntersectionObserver', class {
  observe = vi.fn(); unobserve = vi.fn(); disconnect = vi.fn()
  constructor(public callback: IntersectionObserverCallback) { observers.push(this) }
 })
})
afterEach(() => {
 document.dispatchEvent(new Event('astro:before-swap'))
 document.body.replaceChildren(); observers.length = 0; vi.unstubAllGlobals()
})
function mount(count = 65) {
 const wrapper = document.createElement('section')
 wrapper.innerHTML = `<div class="lm-card-list"><div>${Array.from({ length: count }, (_, i) => `<div data-lm-card-page="${Math.floor(i / 30)}" ${i >= 30 ? 'hidden' : ''}></div>`).join('')}</div><div data-lm-card-more></div></div>`
 document.body.append(wrapper)
 return { wrapper, list: wrapper.firstElementChild as HTMLElement, sentinel: wrapper.querySelector('[data-lm-card-more]')! }
}
function intersect(index: number, target: Element) {
 observers[index].callback([{ target, isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)
}
it('initializes a dynamically mounted list once and reveals successive batches', () => {
 initializeCardLists()
 const { list, sentinel } = mount()
 initializeCardLists(); initializeCardLists()
 expect(observers).toHaveLength(1)
 intersect(0, sentinel)
 expect(list.querySelectorAll('[hidden]')).toHaveLength(5)
 intersect(0, sentinel)
 expect(list.querySelectorAll('[hidden]')).toHaveLength(0)
 expect(observers[0].observe).toHaveBeenCalledTimes(2)
})
it('keeps filtered cards hidden and resumes pagination when a filter is cleared', () => {
 const { wrapper, list, sentinel } = mount(31)
 const last = list.querySelectorAll<HTMLElement>('[data-lm-card-page]')[30]
 last.dataset.filteredOut = ''
 initializeCardLists()
 expect(observers[0].observe).not.toHaveBeenCalled()
 delete last.dataset.filteredOut
 wrapper.dispatchEvent(new CustomEvent('lumen:list-filter', { bubbles: true }))
 expect(observers[0].observe).toHaveBeenCalledTimes(1)
 intersect(0, sentinel)
 expect(last.hidden).toBe(false)
})
it('disconnects removed lists and ignores late observer/filter callbacks', () => {
 const { wrapper, list, sentinel } = mount(31)
 initializeCardLists()
 wrapper.dispatchEvent(new CustomEvent('lumen:content-unmount', { bubbles: true }))
 intersect(0, sentinel)
 wrapper.dispatchEvent(new CustomEvent('lumen:list-filter', { bubbles: true }))
 expect(list.querySelectorAll('[hidden]')).toHaveLength(1)
 expect(observers[0].disconnect).toHaveBeenCalledTimes(1)
 expect(observers[0].observe).toHaveBeenCalledTimes(1)
})
it('paginates nested lists independently', () => {
 const outer = mount(31); const inner = mount(31)
 outer.list.firstElementChild!.append(inner.wrapper)
 initializeCardLists()
 intersect(0, outer.sentinel)
 expect(inner.list.querySelectorAll('[hidden]')).toHaveLength(1)
 intersect(1, inner.sentinel)
 expect(inner.list.querySelectorAll('[hidden]')).toHaveLength(0)
})
