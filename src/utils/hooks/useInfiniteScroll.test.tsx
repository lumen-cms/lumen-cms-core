// @vitest-environment happy-dom
import { act, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { useInfiniteScroll } from './useInfiniteScroll'
const visibility = vi.hoisted(() => ({ inView: false }))
vi.mock('react-intersection-observer', () => ({
  useInView: () => [() => {}, visibility.inView]
}))
it('advances once on entry without a self-triggered update loop', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const host = document.createElement('div')
  const root = createRoot(host)
  let renders = 0
  function Consumer() {
    if (++renders > 12) throw new Error('Unbounded visibility update loop')
    const { data, hasMore } = useInfiniteScroll(
      Array.from({ length: 90 }, (_, i) => i)
    )
    return (
      <div>
        {data.length}:{String(hasMore)}
      </div>
    )
  }
  try {
    await act(async () => root.render(<Consumer />))
    expect(host.textContent).toBe('30:true')
    visibility.inView = true
    await act(async () => root.render(<Consumer />))
    expect(host.textContent).toBe('60:true')
    await act(async () => root.render(<Consumer />))
    expect(host.textContent).toBe('60:true')
    visibility.inView = false
    await act(async () => root.render(<Consumer />))
    visibility.inView = true
    await act(async () => root.render(<Consumer />))
    expect(host.textContent).toBe('90:false')
  } finally {
    await act(async () => root.unmount())
    visibility.inView = false
  }
})

it('retains the page across collection and page-size changes in StrictMode', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const host = document.createElement('div')
  const root = createRoot(host)
  function Consumer({ count, perPage }: { count: number; perPage: number }) {
    const { data, hasMore } = useInfiniteScroll(
      Array.from({ length: count }, (_, i) => i),
      perPage
    )
    return (
      <span>
        {data.length}:{String(hasMore)}
      </span>
    )
  }
  const render = async (count = 100, perPage = 10) => {
    await act(async () =>
      root.render(
        <StrictMode>
          <Consumer count={count} perPage={perPage} />
        </StrictMode>
      )
    )
    return host.textContent
  }
  try {
    expect(await render()).toBe('10:true')
    visibility.inView = true
    expect(await render()).toBe('20:true')
    expect(await render()).toBe('20:true')
    expect(await render(5)).toBe('5:false')
    expect(await render(100, 15)).toBe('30:true')
    visibility.inView = false
    expect(await render(100, 15)).toBe('30:true')
    visibility.inView = true
    expect(await render(100, 15)).toBe('45:true')
  } finally {
    await act(async () => root.unmount())
    visibility.inView = false
  }
})
