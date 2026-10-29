// @vitest-environment happy-dom
import { act, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import LmListStories from './ListStories'
import type { LmListStoriesProps } from './listWidgetTypes'

const route = vi.hoisted(() => ({ listeners: new Set<() => void>() }))
vi.mock('next/router', () => ({
  Router: {
    events: {
      on: (_event: string, handler: () => void) => route.listeners.add(handler),
      off: (_event: string, handler: () => void) =>
        route.listeners.delete(handler)
    }
  }
}))
vi.mock('swr', () => ({
  default: () => ({ data: { stories: [], total: 100 }, isLoading: false })
}))
vi.mock('./listUtils/fetchListStories', () => ({ fetchListStories: vi.fn() }))
vi.mock('../provider/context/AppContext', () => ({
  useAppContext: () => ({ locale: 'en' })
}))
vi.mock('./ListStoriesContainer', () => ({ default: () => null }))
vi.mock('../CoreComponents', () => ({ LmComponentRender: () => null }))
vi.mock('./ListStoriesPagination', () => ({
  default: ({
    page,
    onChange
  }: {
    page: number
    onChange: (page: number) => void
  }) => <button onClick={() => onChange(page + 1)}>Page {page}</button>
}))

it('scrolls only for the latest page and cancels pending scrolling and route listeners on unmount', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.useFakeTimers()
  route.listeners.clear()
  const scroll = vi
    .spyOn(HTMLElement.prototype, 'scrollIntoView')
    .mockImplementation(() => {})
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  let unmounted = false
  const content = {
    component: 'list_stories',
    _uid: 'cleanup',
    list_stories_data: { data: { stories: [] }, total: 100, perPage: 25 }
  } as unknown as LmListStoriesProps['content']
  try {
    await act(async () =>
      root.render(
        <StrictMode>
          <LmListStories content={content} />
        </StrictMode>
      )
    )
    expect(route.listeners.size).toBe(1)
    await act(async () => host.querySelector('button')!.click())
    await act(async () => vi.advanceTimersByTime(500))
    expect(scroll).not.toHaveBeenCalled()
    await act(async () => host.querySelector('button')!.click())
    await act(async () => vi.advanceTimersByTime(500))
    expect(scroll).not.toHaveBeenCalled()
    await act(async () => vi.advanceTimersByTime(500))
    expect(scroll).toHaveBeenCalledExactlyOnceWith({ behavior: 'smooth' })
    await act(async () => host.querySelector('button')!.click())
    await act(async () => root.unmount())
    unmounted = true
    expect(route.listeners.size).toBe(0)
    await act(async () => vi.runAllTimers())
    expect(scroll).toHaveBeenCalledTimes(1)
  } finally {
    if (!unmounted) await act(async () => root.unmount())
    host.remove()
    vi.useRealTimers()
  }
})
