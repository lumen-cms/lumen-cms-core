// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { SWRConfig } from 'swr'
import { expect, it, vi } from 'vitest'
import { AppContext } from '../provider/context/AppContext'
import { useSearchStore } from '../../utils/state/searchState'

const browser = vi.hoisted(() => ({ loaded: vi.fn(), getStories: vi.fn() }))
vi.mock('../../utils/storyblok/browserClient', () => {
  browser.loaded()
  return { getBrowserStories: browser.getStories }
})
vi.mock('next/router', () => ({
  Router: { events: { on: vi.fn(), off: vi.fn() } }
}))
vi.mock('./ListStoriesContainer', () => ({
  default: ({ items }: any) => (
    <div>{items.map((item: any) => item.content.preview_title).join(',')}</div>
  )
}))
vi.mock('./ListStoriesPagination', () => ({
  default: ({ onChange, disabled }: any) => (
    <button disabled={disabled} onClick={() => onChange(2)}>
      Next page
    </button>
  )
}))
import ListStories from './ListStories'

it('renders initial data without loading a client, then fetches pagination and search on demand', async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  useSearchStore.setState({ searchText: undefined, categories: [] })
  const host = document.createElement('div')
  const root = createRoot(host)
  const content = {
    component: 'list_stories',
    _uid: 'test',
    enable_search: true,
    list_stories_data: {
      data: { stories: [{ content: { preview_title: 'Initial' } }], cv: 1 },
      total: 2,
      perPage: 1
    }
  }
  browser.getStories.mockResolvedValue({
    data: { stories: [{ content: { preview_title: 'Fetched' } }], cv: 1 },
    total: 2
  })
  try {
    await act(async () =>
      root.render(
        <SWRConfig
          value={{
            provider: () => new Map(),
            dedupingInterval: 0,
            revalidateOnFocus: false
          }}
        >
          <AppContext.Provider
            value={
              {
                locale: 'en',
                defaultLocale: 'en',
                locales: ['en', 'de']
              } as any
            }
          >
            <ListStories content={content as any} />
          </AppContext.Provider>
        </SWRConfig>
      )
    )
    expect(host.textContent).toContain('Initial')
    expect(browser.loaded).not.toHaveBeenCalled()
    expect(browser.getStories).not.toHaveBeenCalled()
    await act(async () => {
      host.querySelector('button')!.click()
      await vi.dynamicImportSettled()
    })
    expect(browser.loaded).toHaveBeenCalledOnce()
    expect(browser.getStories).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2 })
    )
    expect(host.textContent).toContain('Fetched')
    await act(async () => {
      useSearchStore.setState({ searchText: 'training' })
      await vi.dynamicImportSettled()
    })
    expect(browser.getStories).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 1, search_term: 'training' })
    )
  } finally {
    await act(async () => root.unmount())
    useSearchStore.setState({ searchText: undefined, categories: [] })
  }
})
