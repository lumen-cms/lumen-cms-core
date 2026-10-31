// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import LmFastSpringCheckout from './LmFastSpringCheckout'
import { useFastspringContext } from './context/FastSpringContext'
import type { FastSpringCheckoutProps } from './fastSpringTypes'

const seen = vi.hoisted(() => ({
  content: undefined as FastSpringCheckoutProps['trigger'] | undefined,
  user: null as { sub: string; email: string; id: string } | null
}))
vi.mock('../../CoreComponents', () => ({
  LmComponentRender: ({
    content,
    onClick
  }: {
    content: FastSpringCheckoutProps['trigger']
    onClick: () => void
  }) => {
    seen.content = content
    return <button onClick={onClick}>Checkout</button>
  }
}))
vi.mock('../../auth/useAuth', () => ({ useUserData: () => seen.user }))

const content: FastSpringCheckoutProps['content'] = {
  component: 'ecommerce_fastspring_product',
  _uid: 'product',
  path: 'sku'
}

it('resolves every placeholder from current prices without mutating the template', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const root = createRoot(document.createElement('div'))
  const previous = useFastspringContext.getState()
  const template = '{price}/{price}/{total}/{total}/{discount}/{discount}'
  const trigger = Object.freeze({
    component: 'button' as const,
    _uid: 'trigger',
    label: template,
    text: template,
    text_xs: template
  })
  try {
    useFastspringContext
      .getState()
      .setProducts([
        { path: 'sku', price: '$10', total: '$20', unitDiscount: '$2' }
      ])
    await act(async () =>
      root.render(<LmFastSpringCheckout content={content} trigger={trigger} />)
    )
    expect(seen.content).not.toBe(trigger)
    for (const key of ['label', 'text', 'text_xs'] as const) {
      expect(seen.content?.[key]).toBe('$10/$10/$20/$20/$2/$2')
      expect(trigger[key]).toBe(template)
    }
    await act(async () =>
      useFastspringContext
        .getState()
        .setProducts([
          { path: 'sku', price: '$11', total: '$22', unitDiscount: '$3' }
        ])
    )
    for (const key of ['label', 'text', 'text_xs'] as const) {
      expect(seen.content?.[key]).toBe('$11/$11/$22/$22/$3/$3')
      expect(trigger[key]).toBe(template)
    }
    await act(async () =>
      useFastspringContext.getState().setProducts([{ path: 'sku' }])
    )
    expect(seen.content?.label).toBe('/////')
  } finally {
    await act(async () => root.unmount())
    useFastspringContext.setState(previous)
  }
})

it.each([false, true])(
  'preserves checkout calls, tracking and redirect (text_only=%s)',
  async (textOnly) => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    const push = vi.fn()
    const checkout = vi.fn()
    const gtag = vi.fn()
    const fbq = vi.fn()
    vi.stubGlobal('fastspring', { builder: { push, checkout } })
    vi.stubGlobal('gtag', gtag)
    vi.stubGlobal('fbq', fbq)
    vi.spyOn(console, 'log').mockImplementation(() => {})
    seen.user = { sub: 'auth0|user', email: 'user@example.test', id: 'user-id' }
    const previous = useFastspringContext.getState()
    const host = document.createElement('div')
    const root = createRoot(host)
    try {
      useFastspringContext.setState({ currency: 'EUR', redirect: 'previous' })
      useFastspringContext
        .getState()
        .setProducts([{ path: 'sku', price: '€12', priceValue: 12 }])
      await act(async () =>
        root.render(
          <LmFastSpringCheckout
            content={{
              ...content,
              text_only: textOnly,
              on_successful_redirect: {
                fieldtype: 'multilink',
                linktype: 'url',
                id: '',
                url: '',
                cached_url: 'thanks'
              }
            }}
            trigger={{ component: 'button', _uid: 'trigger', label: '{price}' }}
          />
        )
      )
      await act(async () => host.querySelector('button')!.click())
      if (textOnly) {
        expect(push).not.toHaveBeenCalled()
        expect(checkout).not.toHaveBeenCalled()
        expect(gtag).not.toHaveBeenCalled()
        expect(fbq).not.toHaveBeenCalled()
        expect(useFastspringContext.getState().redirect).toBe('previous')
      } else {
        expect(useFastspringContext.getState().redirect).toBe('/thanks')
        expect(gtag).toHaveBeenCalledExactlyOnceWith(
          'event',
          'begin_checkout',
          {
            items: ['sku'],
            value: 12,
            content_type: 'product',
            currency: 'EUR'
          }
        )
        expect(fbq).toHaveBeenCalledExactlyOnceWith(
          'track',
          'InitiateCheckout',
          {
            content_ids: ['sku'],
            value: 12,
            content_type: 'product',
            currency: 'EUR'
          }
        )
        expect(push).toHaveBeenCalledExactlyOnceWith({
          products: [{ path: 'sku', quantity: 1 }],
          tags: { sub: 'auth0|user', email: 'user@example.test', id: 'user-id' }
        })
        expect(checkout).toHaveBeenCalledOnce()
        expect(push.mock.invocationCallOrder[0]).toBeLessThan(
          checkout.mock.invocationCallOrder[0]
        )
      }
    } finally {
      await act(async () => root.unmount())
      useFastspringContext.setState(previous)
      seen.user = null
    }
  }
)
