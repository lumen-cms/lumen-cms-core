// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { initializeSnackbars } from '../../packages/lumen-cms-astro/src/client/snackbar'
import Cookies from 'js-cookie'
beforeEach(() => vi.useFakeTimers())
afterEach(() => {
 document.dispatchEvent(new Event('astro:before-swap'))
 document.body.replaceChildren()
 vi.useRealTimers()
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
