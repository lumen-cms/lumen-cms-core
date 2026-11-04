// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest'
import { initializeHubspotChat } from '../../packages/lumen-cms-astro/src/client/hubspotChat'
const events = new Map<string, () => void>()
const widget = () => ({ status: () => ({ loaded: false }), load: vi.fn(), open: vi.fn(), remove: vi.fn() })
const setup = () => {
 document.body.innerHTML = '<div data-lm-hubspot-chat><button data-lm-chat-open data-loading-label="Loading" data-error-label="Retry">Chat</button><span data-lm-chat-status></span></div>'
 initializeHubspotChat(); initializeHubspotChat()
 return document.querySelector('button')!
}
const apiReady = () => {
 const api = { widget: widget(), on: (name: string, callback: () => void) => events.set(name, callback), off: (name: string) => events.delete(name) }
 vi.stubGlobal('HubSpotConversations', api)
 ;(window as any).hsConversationsOnReady.forEach((callback: () => void) => callback())
 return api
}
afterEach(() => { document.dispatchEvent(new Event('astro:before-swap')); document.body.replaceChildren(); vi.unstubAllGlobals(); delete (window as any).hsConversationsOnReady; events.clear(); vi.useRealTimers() })
it('waits for the click even if HubSpot initializes first', () => {
 const button = setup(), api = apiReady()
 window.dispatchEvent(new Event('scroll'))
 expect(api.widget.load).not.toHaveBeenCalled()
 button.click(); button.click()
 expect(api.widget.load).toHaveBeenCalledExactlyOnceWith({ widgetOpen: true })
 expect(button.disabled).toBe(true)
 events.get('widgetLoaded')!()
 expect(button.hidden).toBe(true)
 events.get('widgetClosed')!()
 expect(button.hidden).toBe(false)
 expect(button.textContent).toBe('Chat')
 expect(api.widget.remove).toHaveBeenCalledTimes(1)
})
it('remembers a click made before the SDK is ready and cancels callbacks on unmount', () => {
 const button = setup()
 button.click()
 const api = apiReady()
 expect(api.widget.load).toHaveBeenCalledTimes(1)
 document.dispatchEvent(new Event('astro:before-swap'))
 expect((window as any).hsConversationsOnReady).toHaveLength(0)
 expect(events.size).toBe(0)
})
it('returns to a usable button if the SDK is blocked', () => {
 vi.useFakeTimers()
 const button = setup()
 button.click(); vi.advanceTimersByTime(15000)
 expect(button.disabled).toBe(false)
 expect(button.textContent).toBe('Retry')
 const api = apiReady()
 expect(api.widget.load).not.toHaveBeenCalled()
 button.click()
 expect(api.widget.load).toHaveBeenCalledTimes(1)
})
