// @vitest-environment happy-dom
import { act, memo } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { PageContextProvider } from './PageContextProvider'
import { usePageContext } from './PageContext'

it('only notifies readers when filter state changes', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  let renders = 0
  let context: ReturnType<typeof usePageContext>
  const Reader = memo(function Reader() {
    renders++
    context = usePageContext()
    return <span>{JSON.stringify(context.value)}</span>
  })
  const container = document.createElement('div')
  const root = createRoot(container)
  const render = () =>
    root.render(
      <PageContextProvider>
        <Reader />
      </PageContextProvider>
    )
  try {
    await act(render)
    const initialRenders = renders
    await act(render)
    expect(renders).toBe(initialRenders)
    await act(() => context.updateContext({ city: '1' }))
    expect(container.textContent).toBe('{"city":"1"}')
    await act(() => context.updateContext({ country: '2' }))
    expect(JSON.parse(container.textContent!)).toEqual({
      city: '1',
      country: '2'
    })
    await act(() => context.updateContext({ city: '' }))
    expect(container.textContent).toBe('{"country":"2"}')
    expect(window.scrollTo).toHaveBeenCalledTimes(3)
  } finally {
    await act(() => root.unmount())
  }
})
