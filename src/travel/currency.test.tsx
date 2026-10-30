// @vitest-environment happy-dom
import { act } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import { useCurrency } from './components/travel-list/helpers'

it.each(['de', 'en'] as const)(
  'hydrates %s prices before applying browser currency',
  async (locale) => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('en-US')
    function Price() {
      return <span>{useCurrency(locale)}</span>
    }
    const container = document.createElement('div')
    container.innerHTML = renderToString(<Price />)
    expect(container.textContent).toBe('eur')
    document.body.appendChild(container)
    const onRecoverableError = vi.fn()
    let root: ReturnType<typeof hydrateRoot>
    await act(async () => {
      root = hydrateRoot(container, <Price />, { onRecoverableError })
    })
    expect(onRecoverableError).not.toHaveBeenCalled()
    expect(container.textContent).toBe(locale === 'de' ? 'eur' : 'usd')
    await act(async () => {
      root.unmount()
    })
    container.remove()
  }
)
