import { fetchRenderedStories, mountRenderedStories } from './storyListEndpoint'
import { onUnmount } from './lifecycle'
import type { PublicStoryListConfig } from './storyListRequest'
import type { StoryRenderConfig } from './storyListRender'
import { paginationItems } from 'lumen-cms-shared/listStories'
type Config = PublicStoryListConfig & StoryRenderConfig & { total: number; perPage: number; hasInitial: boolean; renderEndpoint?: string }
export function initializeStoryLists() {
 document.querySelectorAll<HTMLElement>('[data-story-list]:not([data-initialized])').forEach(root => {
  root.dataset.initialized = 'true'
  const config: Config = JSON.parse(root.dataset.storyConfig!)
  const results = root.querySelector<HTMLElement>('[data-story-results]')!
  const empty = root.querySelector<HTMLElement>('[data-story-empty]')!
  const loading = root.querySelector<HTMLElement>('[data-story-loading]')!
  const error = root.querySelector<HTMLElement>('[data-story-error]')!
  let page = 1, total = config.total, sequence = 0, busy = false, previousSearch = '', initialized = false, pendingKey = ''
  const read = () => { const params = new URL(location.href).searchParams; return { page: Math.max(1, Number(params.get('page')) || 1), text: params.get('search__text') || '', categories: params.getAll('search__categories') } }
  const pagination = () => {
   const count = Math.ceil(total / config.perPage)
   root.querySelectorAll<HTMLElement>('[data-story-pagination]').forEach(nav => {
    nav.hidden = !!config.content.max_items || count <= 1
    nav.replaceChildren()
    const button = (value: number, label: string, text: string) => {
     const element = document.createElement('button'); element.type = 'button'; element.textContent = text
     element.className = 'btn btn-ghost lm-pagination-button'; element.disabled = busy || value < 1 || value > count
     element.setAttribute('aria-label', label)
     if (value === page && /^\d+$/.test(text)) element.setAttribute('aria-current', 'page')
     element.addEventListener('click', () => { const url = new URL(location.href); url.searchParams.set('page', String(value)); history.pushState({ path: url.href }, '', url); void update(true) })
     nav.append(element)
    }
    button(page - 1, 'Go to previous page', '‹')
    for (const value of paginationItems(page, count)) {
     if (typeof value === 'number') button(value, `${value === page ? '' : 'Go to '}page ${value}`, String(value))
     else { const span = document.createElement('span'); span.textContent = '…'; span.className = 'lm-pagination-ellipsis'; nav.append(span) }
    }
    button(page + 1, 'Go to next page', '›')
   })
  }
  const update = async (scroll = false) => {
   const state = read()
   const searchKey = JSON.stringify([state.text, state.categories])
   if (initialized && previousSearch !== searchKey && (state.text || state.categories.length)) {
    state.page = 1; const url = new URL(location.href); url.searchParams.set('page', '1'); history.replaceState({ path: url.href }, '', url)
   }
   const shouldFetch = initialized || (config.content.enable_search && !config.hasInitial) || state.page > 1 || !!state.text || !!state.categories.length
   previousSearch = searchKey; initialized = true; page = state.page
   if (config.content.max_items || !shouldFetch) { pagination(); return }
   const key = JSON.stringify([page, searchKey])
   if (busy && pendingKey === key) return
   pendingKey = key
   const request = ++sequence; busy = true; results.hidden = true; empty.hidden = true; loading.hidden = false; error.hidden = true; root.setAttribute('aria-busy', 'true'); pagination()
   try {
    if (config.renderEndpoint) {
     const data = await fetchRenderedStories(config.renderEndpoint, root.dataset.storyList!, page, state.text, state.categories)
     if (request !== sequence || !root.isConnected) return
     total = data.total; mountRenderedStories(results, data); empty.hidden = !!data.count
    } else {
     const [{ fetchStoryListPage }, { renderStoryItems }] = await Promise.all([import('./storyListRequest'), import('./storyListRender')])
     if (request !== sequence) return
     const data = await fetchStoryListPage(config, page, state.text, state.categories)
     if (request !== sequence || !root.isConnected) return
     total = data.total; renderStoryItems(root, data.stories, config); empty.hidden = !!data.stories.length
    }
   } catch (cause) {
    if (request !== sequence || !root.isConnected) return
    error.hidden = false; console.error('Unable to load story list', cause)
   } finally {
    if (request === sequence && root.isConnected) { busy = false; loading.hidden = true; root.setAttribute('aria-busy', 'false'); pagination(); if (scroll) root.scrollIntoView({ behavior: 'smooth' }) }
   }
  }
  const searchChanged = () => { const state = read(); if (JSON.stringify([state.text, state.categories]) !== previousSearch) void update() }
  const navigation = () => { void update() }
  document.addEventListener('lumen:search-change', searchChanged)
  window.addEventListener('popstate', navigation)
  error.querySelector('button')?.addEventListener('click', navigation)
  onUnmount(root, () => { ++sequence; document.removeEventListener('lumen:search-change', searchChanged); window.removeEventListener('popstate', navigation) })
  void update()
 })
}
