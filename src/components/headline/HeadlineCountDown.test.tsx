// @vitest-environment happy-dom
import { act, type PropsWithChildren } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import HeadlineCountDown from './HeadlineCountDown'

const captured = vi.hoisted(() => ({ date: undefined as Date | undefined }))
vi.mock('react-countdown', () => ({
  default: ({ date }: { date: Date }) => {
    captured.date = date
    return null
  }
}))
vi.mock('./HeadlineCore', () => ({
  LmHeadlineCore: ({ children }: PropsWithChildren) => <div>{children}</div>
}))
vi.mock('../CoreComponents', () => ({ LmComponentRender: () => null }))

it('samples the fallback only when countdown_time changes and parses configured dates in UTC', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
  const root = createRoot(document.createElement('div'))
  const render = async (countdown_time?: string) => {
    await act(async () =>
      root.render(
        <HeadlineCountDown
          content={{ component: 'headline', _uid: 'countdown', countdown_time }}
        />
      )
    )
  }
  try {
    await render()
    const initial = captured.date
    expect(initial?.toISOString()).toBe('2026-01-01T00:00:00.000Z')
    vi.setSystemTime(new Date('2026-02-01T00:00:00Z'))
    await render()
    expect(captured.date).toBe(initial)
    await render('2026-03-01 12:30')
    expect(captured.date?.toISOString()).toBe('2026-03-01T12:30:00.000Z')
    await render()
    expect(captured.date?.toISOString()).toBe('2026-02-01T00:00:00.000Z')
    expect(captured.date).not.toBe(initial)
  } finally {
    await act(async () => root.unmount())
    vi.useRealTimers()
  }
})
