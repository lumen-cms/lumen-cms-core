// @vitest-environment happy-dom
import { act, StrictMode, type PropsWithChildren } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import LmCardList from './CardList'
import type { LmCardListProps } from './cardTypes'

const visibility = vi.hoisted(() => ({ inView: false }))
vi.mock('react-intersection-observer', () => ({
  useInView: () => [() => {}, visibility.inView]
}))
vi.mock('../../vendor/grid', () => ({
  default: ({ children }: PropsWithChildren) => <div>{children}</div>
}))
vi.mock('@mui/material/Box', () => ({
  default: ({ children }: PropsWithChildren) => <div>{children}</div>
}))
vi.mock('../CoreComponents', () => ({
  LmComponentRender: ({ content }: { content: { _uid: string } }) => (
    <span data-card={content._uid} />
  )
}))

it('preserves entry counts, retained pages and pagination-toggle behavior', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const host = document.createElement('div')
  const root = createRoot(host)
  const content: LmCardListProps['content'] = {
    _uid: 'list',
    component: 'card_list',
    body: Array.from({ length: 150 }, (_, i) => ({
      _uid: String(i),
      component: 'card_list_item' as const
    }))
  }
  const render = async (disablePagination?: boolean, count = 150) => {
    await act(async () =>
      root.render(
        <StrictMode>
          <LmCardList
            content={{ ...content, body: content.body?.slice(0, count) }}
            disablePagination={disablePagination}
          />
        </StrictMode>
      )
    )
    return host.querySelectorAll('[data-card]').length
  }
  try {
    expect(await render()).toBe(30)
    visibility.inView = true
    expect(await render()).toBe(60)
    expect(await render()).toBe(60)
    visibility.inView = false
    expect(await render()).toBe(60)
    visibility.inView = true
    expect(await render()).toBe(90)
    expect(await render(true)).toBe(150)
    expect(await render(false)).toBe(120)
    expect(await render(false, 20)).toBe(20)
    expect(await render(false)).toBe(120)
    expect(host.querySelector('[data-card]')?.getAttribute('data-card')).toBe(
      '0'
    )
  } finally {
    await act(async () => root.unmount())
    visibility.inView = false
  }
})
