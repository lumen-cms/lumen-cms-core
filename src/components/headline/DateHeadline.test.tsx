// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, expect, it, vi } from 'vitest'
import { LmDateHeadline } from './DateHeadline'
import type { LmHeadlineProps } from './headlineTypes'

vi.mock('./Headline', () => ({
  LmHeadline: ({ content }: LmHeadlineProps) => (
    <div>
      <span>{content.text}</span>
      <small>{content.text_xs}</small>
    </div>
  )
}))

afterEach(() => vi.useRealTimers())

const content = {
  component: 'date_headline' as const,
  _uid: 'date',
  text: 'Copyright {date}; {date}',
  text_xs: 'Mobile {date}'
}

it('keeps server output and first-placeholder-only substitution', () => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 5, 1))
  expect(renderToStaticMarkup(<LmDateHeadline content={content} />)).toBe(
    '<div><span>Copyright 2026; {date}</span><small>Mobile 2026</small></div>'
  )
  expect(
    renderToStaticMarkup(
      <LmDateHeadline
        content={{ ...content, text: undefined, text_xs: undefined }}
      />
    )
  ).toBe('<div><span></span><small></small></div>')
})

it('samples a new year on the next render without scheduling a timer', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 11, 31, 12))
  const host = document.createElement('div')
  const root = createRoot(host)
  try {
    await act(async () => root.render(<LmDateHeadline content={content} />))
    expect(host.textContent).toBe('Copyright 2026; {date}Mobile 2026')
    vi.setSystemTime(new Date(2027, 0, 1, 12))
    expect(host.textContent).toBe('Copyright 2026; {date}Mobile 2026')
    await act(async () =>
      root.render(<LmDateHeadline content={{ ...content }} />)
    )
    expect(host.textContent).toBe('Copyright 2027; {date}Mobile 2027')
    expect(vi.getTimerCount()).toBe(0)
  } finally {
    await act(async () => root.unmount())
  }
})
