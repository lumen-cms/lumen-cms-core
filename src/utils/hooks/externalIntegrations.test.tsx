// @vitest-environment happy-dom
// @vitest-environment-options {"settings":{"disableJavaScriptFileLoading":true,"handleDisabledFileLoadingAsSuccess":true}}
import { act, StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { useExternalScript } from './useExternalScript'
import HubspotForm from '../../components/hubspot-meeting/HubspotForm'
import HubspotMeeting from '../../components/hubspot-meeting/HubspotMeeting'
import FacebookChatButton from '../../components/chat/FacebookChatButton'
import TawktoChatButton from '../../components/chat/TawktoChatButton'

vi.mock('@context/AppContext', () => ({
  useAppContext: () => ({ insideStoryblok: false })
}))
vi.mock('./useScrolledOnce', () => ({ useScrollOnce: () => false }))

let host: HTMLDivElement
let root: Root
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})
afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
  document.querySelectorAll('script').forEach((script) => script.remove())
  delete window.hbspt
  delete window.FB
  delete window.fbAsyncInit
})
function Status({ url = '' }: { url?: string }) {
  const status = useExternalScript(url, { attributes: { id: 'test-sdk' } })
  return <span>{status}</span>
}

it('loads only when enabled, shares a script in Strict Mode and reports ready/error', async () => {
  await act(async () => root.render(<Status />))
  expect(document.scripts).toHaveLength(0)
  expect(host.textContent).toBe('idle')
  await act(async () =>
    root.render(
      <StrictMode>
        <Status url="https://scripts.invalid/sdk.js" />
        <Status url="https://scripts.invalid/sdk.js" />
      </StrictMode>
    )
  )
  expect(document.scripts).toHaveLength(1)
  expect(document.scripts[0].id).toBe('test-sdk')
  await act(async () => document.scripts[0].dispatchEvent(new Event('load')))
  expect(host.textContent).toBe('readyready')
  await act(async () =>
    root.render(<Status url="https://scripts.invalid/failure.js" />)
  )
  await act(async () => document.scripts[1].dispatchEvent(new Event('error')))
  expect(host.textContent).toBe('error')
})

it('remembers a script that completes while its consumers are unmounted', async () => {
  const url = 'https://scripts.invalid/delayed.js'
  await act(async () => root.render(<Status url={url} />))
  const script = document.scripts[0]
  await act(async () => root.render(null))
  script.dispatchEvent(new Event('load'))
  await act(async () => root.render(<Status url={url} />))
  expect(document.scripts).toHaveLength(1)
  expect(host.textContent).toBe('ready')
})

it('creates one HubSpot form per configuration despite Strict Mode and rerenders', async () => {
  const create = vi.fn()
  window.hbspt = { forms: { create } }
  const content = {
    component: 'hubspot_form' as const,
    _uid: 'test',
    form_id: 'form',
    portal_id: 'portal',
    region: 'eu1'
  }
  const render = (form = content) => (
    <StrictMode>
      <HubspotForm content={form} />
    </StrictMode>
  )
  await act(async () => root.render(render()))
  expect(create).not.toHaveBeenCalled()
  await act(async () => document.scripts[0].dispatchEvent(new Event('load')))
  await act(async () => root.render(render()))
  expect(create).toHaveBeenCalledExactlyOnceWith({
    region: 'eu1',
    portalId: 'portal',
    formId: 'form',
    target: '#form_test'
  })
  await act(async () =>
    root.render(render({ ...content, form_id: 'replacement' }))
  )
  expect(create).toHaveBeenCalledTimes(2)
  expect(host.innerHTML).toBe('<div id="form_test"></div>')
})

it('keeps the meeting script stable during status changes and host rerenders', async () => {
  const content = {
    component: 'hubspot_meeting' as const,
    _uid: 'meeting',
    meeting_name: 'example'
  }
  await act(async () =>
    root.render(
      <StrictMode>
        <HubspotMeeting content={content} />
      </StrictMode>
    )
  )
  const script = document.scripts[0]
  const markup = host.innerHTML
  await act(async () => script.dispatchEvent(new Event('load')))
  await act(async () =>
    root.render(
      <StrictMode>
        <HubspotMeeting content={{ ...content }} />
      </StrictMode>
    )
  )
  expect(document.scripts).toHaveLength(1)
  expect(document.scripts[0]).toBe(script)
  expect(host.innerHTML).toBe(markup)
})

it('keeps lazy chat disabled before scrolling and registers Facebook initialization before load', async () => {
  const facebook = {
    component: 'chat_facebook' as const,
    _uid: 'facebook',
    page_id: 'example'
  }
  const tawk = {
    component: 'chat_tawkto' as const,
    _uid: 'tawk',
    account: 'example'
  }
  await act(async () =>
    root.render(
      <>
        <FacebookChatButton content={facebook} />
        <TawktoChatButton content={tawk} />
      </>
    )
  )
  expect(document.scripts).toHaveLength(0)
  await act(async () =>
    root.render(
      <FacebookChatButton content={{ ...facebook, disable_lazy: true }} />
    )
  )
  expect(document.scripts[0].id).toBe('facebook-jssdk')
  const init = vi.fn()
  window.FB = {
    init,
    CustomerChat: {
      hide: vi.fn(),
      show: vi.fn(),
      showDialog: vi.fn(),
      hideDialog: vi.fn()
    }
  }
  window.fbAsyncInit?.()
  expect(init).toHaveBeenCalledExactlyOnceWith({ xfbml: true, version: 'v8.0' })
  await act(async () => root.render(null))
  expect(window.fbAsyncInit).toBeUndefined()
})

it('renders chat and embeds on the server without window or scripts', () => {
  vi.stubGlobal('window', undefined)
  try {
    expect(
      renderToString(
        <FacebookChatButton
          content={{
            component: 'chat_facebook',
            _uid: 'fb',
            page_id: 'example',
            disable_lazy: true
          }}
        />
      )
    ).toContain('fb-customerchat')
    expect(
      renderToString(
        <HubspotForm
          content={{
            component: 'hubspot_form',
            _uid: 'form',
            form_id: 'test',
            portal_id: 'portal',
            region: 'eu1'
          }}
        />
      )
    ).toBe('<div id="form_form"></div>')
    expect(
      renderToString(
        <HubspotMeeting
          content={{
            component: 'hubspot_meeting',
            _uid: 'meeting',
            meeting_name: 'example'
          }}
        />
      )
    ).toContain('meetings-iframe-container')
  } finally {
    vi.unstubAllGlobals()
  }
})
