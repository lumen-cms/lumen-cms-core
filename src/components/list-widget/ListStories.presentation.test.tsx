// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import Stories from './ListStories'
import type { LmListStoriesProps } from './listWidgetTypes'
const seen = vi.hoisted(() => ({
  loading: false,
  data: { stories: [], total: 60 } as Record<string, any>,
  key: null as any,
  config: {} as Record<string, any>,
  search: { searchText: '', categories: [] as string[] }
}))
vi.mock('swr', () => ({
  default: (key: unknown, _fetch: unknown, config: Record<string, any>) => {
    seen.key = key
    seen.config = config
    return { data: seen.data, isLoading: seen.loading }
  }
}))
vi.mock('./listUtils/fetchListStories', () => ({ fetchListStories: vi.fn() }))
vi.mock('next/router', () => ({
  Router: { events: { on: vi.fn(), off: vi.fn() } }
}))
vi.mock('../provider/context/AppContext', () => ({
  useAppContext: () => ({ locale: 'en', defaultLocale: 'en', locales: ['en'] })
}))
vi.mock('../../utils/state/searchState', () => ({
  searchTextSelector: (s: any) => s.searchText,
  categorySelector: (s: any) => s.categories,
  useSearchStore: (selector: (s: any) => unknown) => selector(seen.search)
}))
vi.mock('../CoreComponents', () => ({
  LmComponentRender: () => <span>Empty</span>
}))
vi.mock('./ListStoriesContainer', () => ({
  default: ({ items }: { items: { id: string }[] }) => (
    <div data-results>{items.map((i) => i.id).join(',')}</div>
  )
}))
vi.mock('./ListStoriesPagination', () => ({
  default: ({ page, onChange, disabled, totalCount, className }: any) => (
    <button
      data-count={totalCount}
      className={className}
      disabled={disabled}
      onClick={() => onChange(page + 1)}
    >
      Page {page}
    </button>
  )
}))
const content = {
  _uid: 'list',
  component: 'list_stories',
  pagination: [
    {
      _uid: 'pages',
      component: 'list_stories_pagination',
      position: 'top,bottom'
    }
  ],
  not_found_message: [{ _uid: 'empty', component: 'paragraph' }],
  list_stories_data: {
    data: { stories: [{ id: 'initial' }], cv: 7 },
    total: 60,
    perPage: 25
  }
} as unknown as LmListStoriesProps['content']
async function check(
  test: (
    render: (c?: Partial<LmListStoriesProps['content']>) => Promise<void>,
    host: HTMLDivElement
  ) => Promise<void>
) {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  seen.loading = false
  seen.data = { stories: [], total: 60 }
  seen.search = { searchText: '', categories: [] }
  const host = document.createElement('div'),
    root = createRoot(host)
  const render = async (c: Partial<LmListStoriesProps['content']> = {}) => {
    await act(async () =>
      root.render(<Stories content={{ ...content, ...c }} />)
    )
  }
  try {
    await test(render, host)
  } finally {
    await act(async () => root.unmount())
  }
}
it('preserves loading, empty/results branches and pagination positions', async () =>
  check(async (render, host) => {
    seen.loading = true
    await render({ enable_min_height: true })
    expect(host.querySelector('[role="progressbar"]')).not.toBeNull()
    expect(host.textContent).not.toContain('Empty')
    expect(host.querySelectorAll('button')).toHaveLength(2)
    expect(host.querySelector('button')!.disabled).toBe(true)
    seen.loading = false
    await render()
    expect(host.textContent).toContain('Empty')
    expect(host.querySelector('button')!.getAttribute('data-count')).toBe('3')
    seen.data = { stories: [{ id: 'first' }, { id: 'second' }], total: 60 }
    await render()
    expect(host.textContent).toBe('Page 1first,secondPage 1')
    expect(host.querySelectorAll('button')[0].className).toBe('mb-2')
    expect(host.querySelectorAll('button')[1].className).toBe('mt-3')
    await render({ max_items: '5' })
    expect(seen.key).toBeNull()
    expect(host.querySelector('button')).toBeNull()
  }))
it('preserves fallback and revalidation rules, page URLs and search reset', async () =>
  check(async (render, host) => {
    await render({ enable_search: true })
    expect(seen.config.fallbackData).toEqual({
      stories: [{ id: 'initial' }],
      cv: 7,
      total: 60,
      page: 1
    })
    expect(seen.config.revalidateOnMount).toBe(false)
    await act(async () => host.querySelector('button')!.click())
    expect(seen.key.page).toBe(2)
    expect(seen.config.revalidateOnMount).toBe(true)
    expect(new URL(window.location.href).searchParams.get('page')).toBe('2')
    seen.search.searchText = 'term'
    await render()
    expect(seen.key.page).toBe(1)
    expect(seen.key.searchText).toBe('term')
  }))
it('preserves empty fallback and fetch-on-mount without supplied stories', async () =>
  check(async (render) => {
    await render({ enable_search: true, list_stories_data: undefined })
    expect(seen.config.fallbackData).toEqual({
      stories: [],
      cv: undefined,
      total: 0,
      page: 1
    })
    expect(seen.config.revalidateOnMount).toBe(true)
  }))
