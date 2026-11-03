import { onUnmount } from './lifecycle'
import { searchParams, searchLink, type SearchConfig } from 'lumen-cms-shared/search'
import { match, parse } from 'lumen-cms-shared/core/components/list-widget/autosuggest'
type SearchStory = { uuid: string; full_slug: string; name: string; content: { preview_title?: string; title?: string; meta_title?: string } }
const searchRoots = new Set<HTMLElement>()
const searchShortcut = (event: KeyboardEvent) => {
   if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey || event.isComposing || event.defaultPrevented || event.key.toLowerCase() !== 'k') return
   const visibleTrigger = [...document.querySelectorAll<HTMLElement>('[data-lm-search] [data-search-trigger]')].find(element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden')
   if (!visibleTrigger) return
   event.preventDefault()
   if (!event.repeat) visibleTrigger.click()
}
export function initializeSearch() {
 document.querySelectorAll<HTMLElement>('[data-lm-search]').forEach(root => {
  if (root.dataset.initialized) return
  root.dataset.initialized = 'true'
  searchRoots.add(root)
  if (searchRoots.size === 1) document.addEventListener('keydown', searchShortcut)
  const lifecycle = new AbortController()
  const config: SearchConfig = JSON.parse(root.dataset.searchConfig!)
  const dialog = root.querySelector<HTMLDialogElement>('dialog')!
  const trigger = root.querySelector<HTMLElement>('[data-search-trigger]')!
  if (trigger.dataset.lmSearchVersion) {
   const breakpoint = ({ xs: 0, sm: 600, md: 900, lg: 1280, xl: 1920 } as Record<string, number>)[root.dataset.searchBreakpoint || 'xs'] || 0
   const media = matchMedia(`(max-width:${breakpoint - .05}px)`)
   const updateMode = () => { trigger.dataset.lmSearchMode = breakpoint && media.matches ? 'icon' : 'input' }
   updateMode()
   media.addEventListener('change', updateMode, { signal: lifecycle.signal })
  }
  const input = dialog.querySelector<HTMLInputElement>('input')!
  const status = dialog.querySelector<HTMLElement>('[data-search-status]')!
  const retry = dialog.querySelector<HTMLButtonElement>('[data-search-retry]')!
  const results = dialog.querySelector<HTMLUListElement>('ul')!
  let timer: ReturnType<typeof setTimeout>
  let request: AbortController | undefined
  let sequence = 0
  let selected = -1
  const select = (index: number) => {
   const items = Array.from(results.children) as HTMLElement[]
   selected = index
   items.forEach((item, i) => item.setAttribute('aria-selected', String(i === selected)))
   if (items[index]) { input.setAttribute('aria-activedescendant', items[index].id); items[index].scrollIntoView({ block: 'nearest' }) }
   else input.removeAttribute('aria-activedescendant')
  }
  const clear = () => { results.replaceChildren(); select(-1) }
  const load = async () => {
   const query = input.value.trim()
   if (query.length < 2) return
   const current = ++sequence
   request?.abort(); request = new AbortController()
   retry.hidden = true; status.textContent = 'Searching…'
   try {
    const response = await fetch(`https://api.storyblok.com/v2/cdn/stories?${searchParams(query, config)}`, { signal: request.signal })
    if (!response.ok) throw new Error(`Search HTTP ${response.status}`)
    const payload: { stories: SearchStory[] } = await response.json()
    if (current !== sequence || input.value.trim() !== query || !dialog.open) return
    clear()
    for (const story of payload.stories || []) {
     const item = document.createElement('li'); item.id = `search-result-${contentId(root)}-${story.uuid}`; item.setAttribute('role', 'option')
     const link = document.createElement('a'); link.href = searchLink(story.full_slug, config); link.tabIndex = -1
     const title = story.content.preview_title || story.content.title || story.content.meta_title || story.name || ''
     for (const part of parse(title, match(title, query))) { const span = document.createElement('span'); span.textContent = part.text; if (part.highlight) span.style.fontWeight = '700'; link.append(span) }
     item.append(link); results.append(item)
     link.addEventListener('click', () => dialog.close())
     item.addEventListener('mousemove', () => select(Array.from(results.children).indexOf(item)))
    }
    status.textContent = results.children.length ? `${results.children.length} results` : root.dataset.notFound || 'No results found.'
    select(results.children.length ? 0 : -1)
   } catch (error) {
    if (current !== sequence || request.signal.aborted) return
    clear(); status.textContent = 'Search could not be loaded. '; retry.hidden = false
   }
  }
  const open = () => { if (!root.isConnected) return; if (!dialog.open) dialog.showModal(); input.focus() }
  trigger.addEventListener('click', event => { event.preventDefault(); open() })
  dialog.querySelector('[data-search-close]')?.addEventListener('click', () => dialog.close())
  dialog.addEventListener('close', () => { ++sequence; clearTimeout(timer); request?.abort(); input.value = ''; clear(); retry.hidden = true; status.textContent = 'Type at least 2 characters to search.' })
  dialog.addEventListener('click', event => { const rect = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close() })
  input.addEventListener('input', () => { ++sequence; clearTimeout(timer); request?.abort(); clear(); retry.hidden = true; status.textContent = input.value.trim().length < 2 ? 'Type at least 2 characters to search.' : 'Searching…'; timer = setTimeout(load, 400) })
  input.addEventListener('keydown', event => {
   if (event.key === 'Escape') { event.preventDefault(); dialog.close(); return }
   if (!results.children.length) return
   if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); select((selected + (event.key === 'ArrowDown' ? 1 : -1) + results.children.length) % results.children.length) }
   if (event.key === 'Enter' && selected >= 0) { event.preventDefault(); results.children[selected].querySelector<HTMLAnchorElement>('a')?.click() }
  })
  onUnmount(root, () => { searchRoots.delete(root); if (!searchRoots.size) document.removeEventListener('keydown', searchShortcut); lifecycle.abort(); ++sequence; clearTimeout(timer); request?.abort(); dialog.close() })
  retry.addEventListener('click', load)

 })
}
function contentId(root: HTMLElement) { return root.querySelector('dialog')!.id }
