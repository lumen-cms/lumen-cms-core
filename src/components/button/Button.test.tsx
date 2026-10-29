// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { LmButton } from './Button'
import { cmsClickActions } from '../../utils/cmsClickActions'

it('dispatches named CMS actions, ignores code strings, and preserves explicit callbacks', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const registered = vi.fn()
  const explicit = vi.fn()
  const injected = vi.fn()
  vi.stubGlobal('injectedCmsAction', injected)
  cmsClickActions.set('contact', registered)
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  const render = async (action: string, onClick?: () => void) => {
    await act(async () =>
      root.render(
        <LmButton
          content={{
            _uid: 'action',
            component: 'button',
            label: 'Contact',
            on_click_function: action
          }}
          onClick={onClick}
        />
      )
    )
    await act(async () => container.querySelector('button')!.click())
  }
  try {
    await render('contact')
    expect(registered).toHaveBeenCalledOnce()
    await render('globalThis.injectedCmsAction()')
    expect(injected).not.toHaveBeenCalled()
    await render('contact', explicit)
    expect(explicit).toHaveBeenCalledOnce()
    expect(registered).toHaveBeenCalledOnce()
  } finally {
    await act(async () => root.unmount())
    cmsClickActions.clear()
    container.remove()
  }
})

vi.mock('../icon/LmIcon', () => ({
  default: ({ iconName }: { iconName?: string }) =>
    iconName ? <span data-icon={iconName} /> : null
}))

it.each(['raised', 'fab'] as const)(
  'keeps the leading icon mounted for %s buttons',
  async (variant) => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    const onClick = vi.fn()
    const content = {
      _uid: 'button',
      component: 'button' as const,
      label: 'Contact',
      variant,
      icon: { name: 'Email' }
    }
    try {
      await act(async () =>
        root.render(<LmButton content={content} onClick={onClick} />)
      )
      const icon = host.querySelector('[data-icon]')!
      expect(icon).not.toBeNull()
      await act(async () =>
        root.render(
          <LmButton
            content={{ ...content, label: 'Contact us' }}
            onClick={onClick}
          />
        )
      )
      expect(host.querySelector('[data-icon]')).toBe(icon)
      expect(host.textContent).toContain('Contact us')
      await act(async () => host.querySelector('button')!.click())
      expect(onClick).toHaveBeenCalledOnce()
    } finally {
      await act(async () => root.unmount())
      host.remove()
    }
  }
)
