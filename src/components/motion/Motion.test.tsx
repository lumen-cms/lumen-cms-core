// @vitest-environment happy-dom
import { act, StrictMode, useLayoutEffect, type PropsWithChildren } from 'react'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import LmMotion from './Motion'

const fixture = vi.hoisted(() => ({
  inView: true,
  commits: [] as (boolean | undefined)[]
}))
vi.mock('react-intersection-observer', () => ({
  useInView: () => [() => {}, fixture.inView]
}))
vi.mock('@mui/material/Fade', () => ({
  default: function Transition({
    in: active,
    children
  }: PropsWithChildren<{ in?: boolean }>) {
    useLayoutEffect(() => {
      fixture.commits.push(active)
    })
    return <div data-active={String(active)}>{children}</div>
  }
}))
vi.mock('../CoreComponents', () => ({ LmComponentRender: () => null }))

it.each([0, 100])(
  'retains the hidden initial commit and delayed-start behavior (%s ms)',
  async (delay) => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    vi.useFakeTimers()
    fixture.inView = true
    fixture.commits = []
    const host = document.createElement('div')
    const root = createRoot(host)
    const render = async () => {
      await act(async () =>
        root.render(
          <StrictMode>
            <LmMotion
              content={{
                component: 'motion',
                _uid: 'motion',
                delay: String(delay)
              }}
            />
          </StrictMode>
        )
      )
    }
    try {
      await render()
      expect(fixture.commits[0]).toBeUndefined()
      if (delay) {
        expect(fixture.commits.at(-1)).toBeUndefined()
        fixture.inView = false
        await render()
        await act(async () => vi.advanceTimersByTime(delay))
        expect(fixture.commits.at(-1)).toBeUndefined()
        fixture.inView = true
        await render()
        await act(async () => vi.advanceTimersByTime(delay))
      }
      expect(fixture.commits.at(-1)).toBe(true)
      fixture.inView = false
      await render()
      expect(fixture.commits.at(-1)).toBe(true)
    } finally {
      await act(async () => root.unmount())
      expect(vi.getTimerCount()).toBe(0)
      vi.useRealTimers()
    }
  }
)

it('keeps server rendering hidden without scheduling animation timers', () => {
  vi.useFakeTimers()
  fixture.inView = true
  try {
    const markup = renderToStaticMarkup(
      <LmMotion
        content={{ component: 'motion', _uid: 'server', delay: '100' }}
      />
    )
    expect(markup).toContain('data-active="undefined"')
    expect(vi.getTimerCount()).toBe(0)
  } finally {
    vi.useRealTimers()
  }
})

it('cancels the previous delay on configuration changes without restarting on unrelated renders', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.useFakeTimers()
  fixture.inView = true
  fixture.commits = []
  const root = createRoot(document.createElement('div'))
  const render = async (delay: string) => {
    await act(async () =>
      root.render(
        <LmMotion content={{ component: 'motion', _uid: 'delay', delay }} />
      )
    )
  }
  try {
    await render('100')
    await act(async () => vi.advanceTimersByTime(40))
    await render('200')
    await act(async () => vi.advanceTimersByTime(60))
    expect(fixture.commits.at(-1)).toBeUndefined()
    await render('200')
    await act(async () => vi.advanceTimersByTime(139))
    expect(fixture.commits.at(-1)).toBeUndefined()
    await act(async () => vi.advanceTimersByTime(1))
    expect(fixture.commits.at(-1)).toBe(true)
  } finally {
    await act(async () => root.unmount())
    expect(vi.getTimerCount()).toBe(0)
    vi.useRealTimers()
  }
})
