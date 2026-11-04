// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest'
import { initializeChat } from '../../packages/lumen-cms-astro/src/client/chat'
import { loadExternalScript } from '../../packages/lumen-cms-astro/src/client/externalScript'
vi.mock('../../packages/lumen-cms-astro/src/client/externalScript', () => ({ loadExternalScript: vi.fn().mockResolvedValue(undefined) }))
afterEach(() => { document.dispatchEvent(new Event('astro:before-swap')); document.body.replaceChildren(); vi.mocked(loadExternalScript).mockReset().mockResolvedValue(undefined); vi.unstubAllGlobals(); delete (window as any).Tawk_API; vi.useRealTimers() })
const setup = (provider = 'tawkto', extra = '') => {
 document.body.innerHTML = `<div data-lm-chat="${provider}" data-account="fixture-account" ${extra}><button data-lm-chat-open>Open chat</button><span data-lm-chat-status></span></div>`
 initializeChat(); initializeChat()
 return document.querySelector('button')!
}
it('loads only after a click, waits for provider readiness and opens the chat once', async () => {
 const button = setup('tawkto', 'data-eager="true"')
 window.dispatchEvent(new Event('scroll'))
 expect(loadExternalScript).not.toHaveBeenCalled()
 button.click(); button.click()
 expect(loadExternalScript).toHaveBeenCalledTimes(1)
 expect(button.disabled).toBe(true)
 const api = (window as any).Tawk_API
 api.showWidget = vi.fn(); api.maximize = vi.fn(); api.hideWidget = vi.fn()
 api.onLoad()
 expect(api.maximize).toHaveBeenCalledTimes(1)
 expect(button.hidden).toBe(true)
 document.dispatchEvent(new Event('astro:before-swap'))
 expect(api.hideWidget).toHaveBeenCalledTimes(1)
})
it('does not load in preview or after unmount', () => {
 const button = setup('tawkto', 'data-preview="true"')
 button.click()
 expect(loadExternalScript).not.toHaveBeenCalled()
 setup()
 document.dispatchEvent(new Event('astro:before-swap'))
 document.querySelector('button')!.click()
 expect(loadExternalScript).not.toHaveBeenCalled()
})
it('offers retry after a provider timeout', () => {
 vi.useFakeTimers()
 const button = setup()
 button.click(); vi.advanceTimersByTime(15000)
 expect(button.disabled).toBe(false)
 expect(button.textContent).toBe('Retry chat')
 button.click()
 expect(loadExternalScript).toHaveBeenCalledTimes(2)
})
it('opens an existing Facebook API after the click and restores callbacks on unmount', () => {
 const previous = vi.fn(), init = vi.fn(), show = vi.fn(), hide = vi.fn()
 vi.stubGlobal('fbAsyncInit', previous)
 vi.stubGlobal('FB', { init, CustomerChat: { show, hide } })
 const button = setup('facebook')
 expect(show).not.toHaveBeenCalled()
 button.click()
 expect(init).toHaveBeenCalledWith({ xfbml: true, version: 'v8.0' })
 expect(show).toHaveBeenCalledTimes(1)
 document.dispatchEvent(new Event('astro:before-swap'))
 expect((window as any).fbAsyncInit).toBe(previous)
 expect(hide).toHaveBeenCalledTimes(1)
})
