// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest'
import { initializeChat } from '../../packages/lumen-cms-astro/src/client/chat'
import { loadExternalScript } from '../../packages/lumen-cms-astro/src/client/externalScript'
vi.mock('../../packages/lumen-cms-astro/src/client/externalScript', () => ({ loadExternalScript: vi.fn().mockResolvedValue(undefined) }))
afterEach(() => { document.dispatchEvent(new Event('astro:before-swap')); document.body.replaceChildren(); vi.mocked(loadExternalScript).mockClear() })

it('loads Tawk once after scrolling and hides it on unmount', async () => {
 const showWidget = vi.fn(), hideWidget = vi.fn()
 vi.stubGlobal('Tawk_API', { isChatHidden: () => true, showWidget, hideWidget })
 document.body.innerHTML = '<div data-lm-chat="tawkto" data-account="fixture-account"></div>'
 initializeChat(); initializeChat()
 expect(showWidget).toHaveBeenCalledTimes(1)
 expect(loadExternalScript).not.toHaveBeenCalled()
 window.dispatchEvent(new Event('scroll')); window.dispatchEvent(new Event('scroll'))
 await vi.waitFor(() => expect(document.querySelector('[data-chat-state="ready"]')).not.toBeNull())
 expect(loadExternalScript).toHaveBeenCalledTimes(1)
 expect(loadExternalScript).toHaveBeenCalledWith('https://embed.tawk.to/fixture-account/default', undefined)
 document.dispatchEvent(new Event('astro:before-swap'))
 expect(hideWidget).toHaveBeenCalledTimes(1)
})

it('never loads widgets in preview or after an unmounted lazy instance', () => {
 document.body.innerHTML = '<div data-lm-chat="facebook" data-account="page" data-preview="true" data-eager="true"></div><dialog><div data-lm-chat="tawkto" data-account="account"></div></dialog>'
 initializeChat()
 document.querySelector('dialog')!.dispatchEvent(new CustomEvent('lumen:content-unmount', { bubbles: true }))
 window.dispatchEvent(new Event('scroll'))
 expect(loadExternalScript).not.toHaveBeenCalled()
 expect(document.querySelector('.fb-customerchat')).toBeNull()
})

it('initializes Facebook with legacy options and restores its previous callback', async () => {
 const previous = vi.fn(), init = vi.fn(), hide = vi.fn()
 vi.stubGlobal('fbAsyncInit', previous)
 vi.stubGlobal('FB', { init, CustomerChat: { show: vi.fn(), hide } })
 document.body.innerHTML = '<div data-lm-chat="facebook" data-account="fixture-page" data-eager="true"></div>'
 initializeChat()
 await vi.waitFor(() => expect(document.querySelector('[data-chat-state="ready"]')).not.toBeNull())
 expect(init).toHaveBeenCalledWith({ xfbml: true, version: 'v8.0' })
 expect(document.querySelector('.fb-customerchat')?.getAttribute('page_id')).toBe('fixture-page')
 expect(loadExternalScript).toHaveBeenCalledWith('https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js', { id: 'facebook-jssdk' })
 document.dispatchEvent(new Event('astro:before-swap'))
 expect((window as Window & { fbAsyncInit?: unknown }).fbAsyncInit).toBe(previous)
 expect(hide).toHaveBeenCalledTimes(1)
})
