// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, expect, it, vi } from 'vitest'
import Snackbar from './Snackbar'
import type { LmSnackbarProps } from './snackbarTypes'
const fixture = vi.hoisted(() => ({
  scrolled: false,
  cookie: undefined as string | undefined,
  opens: [] as boolean[],
  setCookie: vi.fn()
}))
vi.mock('../../utils/hooks/useScrolledOnce', () => ({
  useScrollOnce: () => fixture.scrolled
}))
vi.mock('js-cookie', () => ({
  default: { get: () => fixture.cookie, set: fixture.setCookie }
}))
vi.mock('@mui/material/Snackbar', () => ({
  default: ({ open, children }: any) => {
    fixture.opens.push(open)
    return <div data-open={String(open)}>{children}</div>
  }
}))
vi.mock('@mui/material/SnackbarContent', () => ({
  default: ({ action }: any) => <div>{action}</div>
}))
vi.mock('../CoreComponents', () => ({
  LmComponentRender: ({ onClick }: any) => (
    <button onClick={onClick}>Accept</button>
  )
}))
const content = {
  _uid: 'notice',
  component: 'snackbar',
  close_action: [{ _uid: 'accept', component: 'button' }]
} as LmSnackbarProps['content']
afterEach(() => {
  fixture.scrolled = false
  fixture.cookie = undefined
  fixture.opens = []
  vi.useRealTimers()
})
it('updates visibility before rendering children and preserves dismissal across unrelated updates', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const host = document.createElement('div')
  const root = createRoot(host)
  try {
    await act(async () => root.render(<Snackbar content={content} />))
    expect(host.querySelector('[data-open]')?.getAttribute('data-open')).toBe(
      'true'
    )
    fixture.opens = []
    await act(async () =>
      root.render(
        <Snackbar content={{ ...content, display: 'show_on_scroll' }} />
      )
    )
    expect(fixture.opens).toEqual([false])
    fixture.scrolled = true
    fixture.opens = []
    await act(async () =>
      root.render(
        <Snackbar content={{ ...content, display: 'show_on_scroll' }} />
      )
    )
    expect(fixture.opens).toEqual([true])
    await act(async () => host.querySelector('button')!.click())
    await act(async () =>
      root.render(
        <Snackbar
          content={{ ...content, display: 'show_on_scroll', square: true }}
        />
      )
    )
    expect(host.querySelector('[data-open]')?.getAttribute('data-open')).toBe(
      'false'
    )
  } finally {
    await act(async () => root.unmount())
  }
})
it('keeps delayed show/close timing and cancels timers on unmount', async () => {
  vi.useFakeTimers()
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const host = document.createElement('div')
  const root = createRoot(host)
  await act(async () =>
    root.render(
      <Snackbar content={{ ...content, auto_show: '100', auto_close: '200' }} />
    )
  )
  expect(host.querySelector('[data-open]')?.getAttribute('data-open')).toBe(
    'false'
  )
  await act(async () => vi.advanceTimersByTime(100))
  expect(host.querySelector('[data-open]')?.getAttribute('data-open')).toBe(
    'true'
  )
  await act(async () => vi.advanceTimersByTime(100))
  expect(host.querySelector('[data-open]')?.getAttribute('data-open')).toBe(
    'false'
  )
  await act(async () => root.unmount())
  expect(vi.getTimerCount()).toBe(0)
})
it('keeps SSR closed and honors an existing dismissal cookie', async () => {
  expect(renderToString(<Snackbar content={content} />)).toContain(
    'data-open="false"'
  )
  fixture.cookie = 'true'
  expect(
    renderToString(<Snackbar content={{ ...content, cookie_name: 'notice' }} />)
  ).toBe('')
})

it('writes dismissal cookies and does not restart opening after acceptance', async () => {
  vi.useFakeTimers()
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  fixture.setCookie.mockClear()
  const host = document.createElement('div')
  const root = createRoot(host)
  try {
    await act(async () =>
      root.render(
        <Snackbar
          content={{ ...content, cookie_name: 'notice', expire_in_days: '7' }}
        />
      )
    )
    await act(async () => host.querySelector('button')!.click())
    expect(fixture.setCookie).toHaveBeenCalledWith(
      'notice',
      'true',
      expect.objectContaining({ expires: 7, sameSite: 'lax' })
    )
    expect(host.textContent).toBe('')
    expect(vi.getTimerCount()).toBe(0)
  } finally {
    await act(async () => root.unmount())
  }
})
it('hides on scroll and cancels pending timers on unmount', async () => {
  vi.useFakeTimers()
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const host = document.createElement('div')
  const root = createRoot(host)
  await act(async () =>
    root.render(
      <Snackbar
        content={{ ...content, display: 'hide_on_scroll', auto_close: '1000' }}
      />
    )
  )
  expect(host.querySelector('[data-open]')?.getAttribute('data-open')).toBe(
    'true'
  )
  fixture.scrolled = true
  fixture.opens = []
  await act(async () =>
    root.render(
      <Snackbar
        content={{ ...content, display: 'hide_on_scroll', auto_close: '1000' }}
      />
    )
  )
  expect(fixture.opens).toEqual([false])
  expect(vi.getTimerCount()).toBe(1)
  await act(async () => root.unmount())
  expect(vi.getTimerCount()).toBe(0)
})

it('hydrates the closed server markup before opening without replacing its DOM', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const host = document.createElement('div')
  host.innerHTML = renderToString(<Snackbar content={content} />)
  const element = host.querySelector('[data-open]')
  const onRecoverableError = vi.fn()
  let root!: ReturnType<typeof hydrateRoot>
  try {
    await act(async () => {
      root = hydrateRoot(host, <Snackbar content={content} />, {
        onRecoverableError
      })
    })
    expect(onRecoverableError).not.toHaveBeenCalled()
    expect(host.querySelector('[data-open]')).toBe(element)
    expect(element?.getAttribute('data-open')).toBe('true')
  } finally {
    await act(async () => root.unmount())
  }
})
