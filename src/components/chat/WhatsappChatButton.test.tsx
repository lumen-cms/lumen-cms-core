// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import LmWhatsappChatButton from './WhatsappChatButton'

it('opens WhatsApp without giving the new tab access to its opener', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const open = vi.spyOn(window, 'open').mockReturnValue(null)
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  try {
    await act(async () =>
      root.render(
        <LmWhatsappChatButton
          content={{
            _uid: 'chat',
            component: 'chat_whatsapp',
            phone_number: '+49 123456'
          }}
        />
      )
    )
    await act(async () => container.querySelector('button')!.click())
    expect(open).toHaveBeenCalledWith(
      'https://wa.me/49123456',
      '_blank',
      'noopener'
    )
  } finally {
    await act(async () => root.unmount())
    container.remove()
  }
})
