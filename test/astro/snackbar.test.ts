// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import Cookies from 'js-cookie'
import { initializeSnackbars } from '../../packages/lumen-cms-astro/src/client/snackbar'

function mount(options: Record<string, unknown> = {}) {
 document.dispatchEvent(new Event('astro:before-swap'))
 document.body.innerHTML = '<div data-lm-snackbar hidden><span data-snackbar-accept><button>Close</button></span></div>'
 const root = document.querySelector<HTMLElement>('[data-lm-snackbar]')!
 root.dataset.options = JSON.stringify({ id: 'promo', display: 'show_on_scroll', ...options })
 initializeSnackbars()
 return root
}

const scroll = () => window.dispatchEvent(new Event('scroll'))
const close = (root: HTMLElement) => root.querySelector('button')!.click()

beforeEach(() => {
 vi.useFakeTimers()
 vi.setSystemTime(new Date('2026-11-16T00:00:00Z'))
 sessionStorage.clear()
})

afterEach(() => {
 document.dispatchEvent(new Event('astro:before-swap'))
 document.body.replaceChildren()
 vi.restoreAllMocks()
 vi.useRealTimers()
})

it('remembers closing across page navigation, independently for each toast', () => {
 const first = mount()
 scroll()
 expect(first.hidden).toBe(false)
 close(first)
 expect(first.hidden).toBe(true)
 const next = mount()
 scroll()
 expect(next.hidden).toBe(true)
 const other = mount({ id: 'other-promo' })
 scroll()
 expect(other.hidden).toBe(false)
})

it('expires four hours after closing without extending the duration on navigation', () => {
 close(mount())
 vi.advanceTimersByTime(3 * 60 * 60 * 1000)
 const beforeExpiry = mount()
 scroll()
 expect(beforeExpiry.hidden).toBe(true)
 vi.advanceTimersByTime(60 * 60 * 1000)
 const afterExpiry = mount()
 scroll()
 expect(afterExpiry.hidden).toBe(false)
})

it('does not let a pending auto-show timer reopen a dismissed toast', () => {
 const root = mount({ autoShow: 1000 })
 scroll()
 close(root)
 vi.advanceTimersByTime(1000)
 expect(root.hidden).toBe(true)
})

it('does not remember automatic closing', () => {
 const root = mount({ autoClose: 1000 })
 scroll()
 vi.advanceTimersByTime(1000)
 expect(root.hidden).toBe(true)
 const next = mount()
 scroll()
 expect(next.hidden).toBe(false)
})

it('ignores stored dismissals in preview and does not persist preview closing', () => {
 close(mount())
 const preview = mount({ preview: true })
 scroll()
 expect(preview.hidden).toBe(false)
 sessionStorage.clear()
 close(preview)
 expect(sessionStorage.length).toBe(0)
})

it('still closes and suppresses timers when session storage is blocked', () => {
 vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
 vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
 const root = mount({ autoShow: 1000 })
 scroll()
 close(root)
 vi.advanceTimersByTime(1000)
 expect(root.hidden).toBe(true)
})

function notice(options: object) {
 const root = document.createElement('div')
 root.dataset.lmSnackbar = ''; root.dataset.options = JSON.stringify(options)
 root.innerHTML = '<span data-snackbar-accept><a href="/must-not-navigate">Dismiss</a></span>'
 document.body.append(root); initializeSnackbars()
 return root
}
it('cancels delayed visibility changes and scroll handlers when preview content unmounts', () => {
 const delayed = notice({ autoShow: '500' })
 const scrolling = notice({ display: 'show_on_scroll' })
 expect(delayed.hidden).toBe(true); expect(scrolling.hidden).toBe(true)
 document.dispatchEvent(new Event('astro:before-swap'))
 vi.advanceTimersByTime(600)
 window.dispatchEvent(new Event('scroll'))
 expect(delayed.hidden).toBe(true); expect(scrolling.hidden).toBe(true)
})
it('preserves delayed opening and closing without duplicate timers on remount initialization', () => {
 const root = notice({ autoShow: '100', autoClose: '300' })
 initializeSnackbars()
 vi.advanceTimersByTime(100); expect(root.hidden).toBe(false)
 vi.advanceTimersByTime(200); expect(root.hidden).toBe(true)
})
it('dismisses linked close actions without navigation and preserves zero-day expiry', () => {
 const setCookie = vi.spyOn(Cookies, 'set')
 const root = notice({ cookie: 'notice-fixture', days: '0' })
 const click = new MouseEvent('click', { bubbles: true, cancelable: true })
 root.querySelector('a')!.dispatchEvent(click)
 expect(click.defaultPrevented).toBe(true)
 expect(root.hidden).toBe(true)
 expect(setCookie).toHaveBeenCalledWith('notice-fixture', 'true', expect.objectContaining({ expires: 0 }))
})
