// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import AppProvider from './AppProvider'
import { useAppContext, type AppContextProps } from './context/AppContext'
it('publishes current route and locale on the first render while retaining mount-time settings', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  const renders: AppContextProps[] = []
  function Consumer() {
    const value = useAppContext()
    renders.push(value)
    return (
      <span>
        {value.locale}:{value.slug}
      </span>
    )
  }
  const initial = {
    locale: 'en',
    slug: '/old',
    defaultLocale: 'en',
    locales: ['en', 'de'],
    insideStoryblok: false
  }
  try {
    await act(async () =>
      root.render(
        <AppProvider content={initial}>
          <Consumer />
        </AppProvider>
      )
    )
    renders.length = 0
    await act(async () =>
      root.render(
        <AppProvider
          content={{
            ...initial,
            locale: 'de',
            slug: '/new',
            insideStoryblok: true
          }}
        >
          <Consumer />
        </AppProvider>
      )
    )
    expect(renders).toHaveLength(1)
    expect(renders[0]).toEqual({ ...initial, locale: 'de', slug: '/new' })
    expect(host.textContent).toBe('de:/new')
  } finally {
    await act(async () => root.unmount())
    host.remove()
  }
})
