// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { initializeTabs } from '../../packages/lumen-cms-astro/src/client/tabs'

let media: EventTarget & { matches: boolean }
const disconnects: ReturnType<typeof vi.fn>[] = []
beforeEach(() => {
 media = Object.assign(new EventTarget(), { matches: false })
 vi.stubGlobal('matchMedia', vi.fn(() => media))
 vi.stubGlobal('ResizeObserver', class {
  observe = vi.fn()
  disconnect = vi.fn()
  constructor() { disconnects.push(this.disconnect) }
 })
 vi.spyOn(HTMLElement.prototype, 'scrollBy').mockImplementation(() => {})
})
afterEach(() => {
 document.dispatchEvent(new Event('astro:before-swap'))
 document.body.replaceChildren(); disconnects.length = 0
 vi.restoreAllMocks(); vi.unstubAllGlobals()
})
function fixture(count = 3) {
 document.body.innerHTML = `<div data-lm-tabs data-vertical="true" data-centered="true" data-variant="fullWidth" data-mobile-below="600"><div role="tablist">${Array.from({ length: count }, (_, i) => `<button role="tab" aria-selected="${i === 0}">${i}</button>`).join('')}</div><div class="lm-tab-panels">${Array.from({ length: count }, (_, i) => `<div role="tabpanel"><div class="lm-tab-panel"><input value="${i}"></div></div>`).join('')}</div></div>`
 initializeTabs()
 return { root: document.querySelector<HTMLElement>('[data-lm-tabs]')!, tabs: [...document.querySelectorAll<HTMLButtonElement>('[role=tab]')], panels: [...document.querySelectorAll<HTMLElement>('[role=tabpanel]')] }
}
it('matches MUI manual keyboard activation and wraps focus without selecting panels', () => {
 const { tabs, panels } = fixture()
 tabs[0].focus()
 tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }))
 expect(document.activeElement).toBe(tabs[2])
 expect(tabs[0].getAttribute('aria-selected')).toBe('true')
 tabs[2].click()
 expect(tabs[2].getAttribute('aria-selected')).toBe('true')
 expect(panels[0].inert).toBe(true)
 expect(panels[0].tabIndex).toBe(-1)
 expect(panels[2].inert).toBe(false)
 expect(panels[2].querySelector<HTMLElement>('.lm-tab-panel')!.hidden).toBe(false)
})
it('preserves selection across responsive orientation changes', () => {
 const { root, tabs } = fixture()
 tabs[1].click()
 expect(root.classList.contains('lm-tabs-vertical')).toBe(true)
 media.matches = true; media.dispatchEvent(new Event('change'))
 expect(root.classList.contains('lm-tabs-vertical')).toBe(false)
 expect(root.querySelector('[role=tablist]')?.getAttribute('aria-orientation')).toBe('horizontal')
 expect(tabs[1].getAttribute('aria-selected')).toBe('true')
})
it('does not leave focus inside an inactive panel and preserves native form state', () => {
 const { tabs, panels } = fixture()
 const input = panels[0].querySelector('input')!
 input.value = 'edited'; input.focus()
 tabs[1].click()
 expect(document.activeElement).toBe(tabs[1])
 tabs[0].click()
 expect(input.value).toBe('edited')
})
it('disposes observers and listeners before a retained DOM remount', () => {
 const { tabs } = fixture()
 document.dispatchEvent(new Event('astro:before-swap'))
 expect(disconnects[0]).toHaveBeenCalledOnce()
 tabs[1].click()
 expect(tabs[0].getAttribute('aria-selected')).toBe('true')
 initializeTabs(); initializeTabs()
 expect(disconnects).toHaveLength(2)
 tabs[1].click()
 expect(tabs[1].getAttribute('aria-selected')).toBe('true')
})
it.each([0, 1])('handles %i tab items without invalid selection', count => {
 const { root, tabs } = fixture(count)
 expect(root.dataset.initialized).toBe('true')
 tabs[0]?.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
 expect(root.querySelectorAll('[aria-selected=true]')).toHaveLength(count)
})
