// @vitest-environment happy-dom
import { act } from 'react'
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
