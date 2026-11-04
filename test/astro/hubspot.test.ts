// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { initializeHubspot } from '../../packages/lumen-cms-astro/src/client/hubspot'
import { loadExternalScript } from '../../packages/lumen-cms-astro/src/client/externalScript'
vi.mock('../../packages/lumen-cms-astro/src/client/externalScript', () => ({ loadExternalScript: vi.fn().mockResolvedValue(undefined) }))
let observers: { callback: (entries: { isIntersecting: boolean }[]) => void; disconnect: ReturnType<typeof vi.fn> }[]
beforeEach(() => {
 observers = []
 vi.stubGlobal('IntersectionObserver', class {
  disconnect = vi.fn()
  constructor(public callback: (entries: { isIntersecting: boolean }[]) => void) { observers.push(this) }
  observe() {}
 })
})
const reveal = () => observers.forEach(observer => observer.callback([{ isIntersecting: true }]))
afterEach(() => { document.dispatchEvent(new Event('astro:before-swap')); document.body.replaceChildren(); vi.mocked(loadExternalScript).mockReset().mockResolvedValue(undefined); vi.unstubAllGlobals() })

it('creates each form once with unchanged provider configuration', async () => {
 const create = vi.fn()
 vi.stubGlobal('hbspt', { forms: { create } })
 document.body.innerHTML = '<div id="form_fixture" data-lm-hubspot="form" data-region="eu1" data-portal-id="portal" data-form-id="form"></div>'
 initializeHubspot(); initializeHubspot()
 expect(loadExternalScript).not.toHaveBeenCalled()
 reveal(); reveal()
 await vi.waitFor(() => expect(create).toHaveBeenCalledTimes(1))
 expect(create).toHaveBeenCalledWith({ region: 'eu1', portalId: 'portal', formId: 'form', target: '#form_fixture' })
 expect(loadExternalScript).toHaveBeenCalledWith('https://js.hsforms.net/forms/shell.js')
})

it('does not create a form after its container unmounts while loading', async () => {
 let resolve!: () => void
 vi.mocked(loadExternalScript).mockImplementationOnce(() => new Promise<void>(done => { resolve = done }))
 const create = vi.fn()
 vi.stubGlobal('hbspt', { forms: { create } })
 document.body.innerHTML = '<dialog><div id="form_late" data-lm-hubspot="form"></div></dialog>'
 initializeHubspot()
 reveal()
 document.querySelector('dialog')!.dispatchEvent(new CustomEvent('lumen:content-unmount', { bubbles: true }))
 resolve(); await Promise.resolve(); await Promise.resolve()
 expect(create).not.toHaveBeenCalled()
})

it('loads meetings per mount and preserves embed options and names', async () => {
 document.body.innerHTML = '<div id="meeting_one" data-lm-hubspot="meeting" data-meeting-name="team/person" data-embed="false"></div><div data-lm-hubspot="meeting"></div>'
 initializeHubspot(); initializeHubspot()
 expect(loadExternalScript).not.toHaveBeenCalled()
 reveal(); reveal()
 await vi.waitFor(() => expect(document.querySelector('#meeting_one')?.getAttribute('data-hubspot-state')).toBe('ready'))
 expect(loadExternalScript).toHaveBeenCalledTimes(1)
 const url = new URL(vi.mocked(loadExternalScript).mock.calls[0][0])
 expect(url.searchParams.get('meeting')).toBe('team/person')
 expect(url.searchParams.get('embed')).toBe('false')
 expect(document.querySelector('[data-hubspot-state="empty"]')).not.toBeNull()
})

it('disconnects offscreen embeds without starting requests after unmount', () => {
 document.body.innerHTML = '<div data-lm-hubspot="form"></div>'
 initializeHubspot()
 document.dispatchEvent(new Event('astro:before-swap'))
 reveal()
 expect(loadExternalScript).not.toHaveBeenCalled()
 expect(observers[0].disconnect).toHaveBeenCalled()
})
