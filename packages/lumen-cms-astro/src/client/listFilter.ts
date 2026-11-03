import { onUnmount } from './lifecycle'
import { filterListItems, type SearchableListItem } from 'lumen-cms-shared/listFilter'
import { addSearchParamsToUrl } from 'lumen-cms-shared/core/utils/state/actions'
let bound = false
export function initializeListFilters() {
 const read = () => { const params = new URL(location.href).searchParams; return { text: params.get('search__text') || '', categories: params.getAll('search__categories') } }
 const update = () => {
  const { text, categories } = read()
  document.querySelectorAll<HTMLElement>('[data-lm-list-widget]').forEach(widget => {
   const items: SearchableListItem[] = JSON.parse(widget.dataset.listItems || '[]')
   const allIds = new Set(items.map(item => item.uuid))
   const matches = text || categories.length ? filterListItems(items, categories, text) : items
   const ids = new Set(matches.map(item => item.uuid))
   let count = 0
   widget.querySelectorAll<HTMLElement>('[data-lm-list-item]').forEach(element => {
    const id = element.dataset.lmListItem!
    if (!allIds.has(id)) return
    const included = ids.has(id)
    element.toggleAttribute('data-filtered-out', !included)
    element.hidden = !included || (element.hasAttribute('data-lm-card-page') && count >= 30)
    if (included) count++
   })
   const empty = widget.querySelector<HTMLElement>('[data-list-empty]')
   if (empty) empty.hidden = !!matches.length
   widget.dispatchEvent(new CustomEvent('lumen:list-filter', { bubbles: true }))
  })
  document.querySelectorAll<HTMLInputElement>('[data-list-search] input').forEach(input => { if (document.activeElement !== input) input.value = text })
  document.querySelectorAll<HTMLInputElement>('[data-category-box] input[type=checkbox]').forEach(input => input.checked = categories.includes(input.value))
  document.dispatchEvent(new CustomEvent('lumen:search-change'))
 }
 document.querySelectorAll<HTMLElement>('[data-list-search]').forEach(root => {
  if (root.dataset.initialized) return
  root.dataset.initialized = 'true'
  const input = root.querySelector<HTMLInputElement>('input')!
  const clear = root.querySelector<HTMLButtonElement>('button')!
  let timer: ReturnType<typeof setTimeout>
  const listeners = new AbortController()
  onUnmount(root, () => { clearTimeout(timer); listeners.abort() })
  input.value = read().text
  const commit = () => { addSearchParamsToUrl({ searchText: input.value }); update() }
  clear.hidden = !input.value
  input.addEventListener('input', () => { clear.hidden = !input.value; clearTimeout(timer); timer = setTimeout(commit, 500) }, { signal: listeners.signal })
  clear.addEventListener('click', () => { clearTimeout(timer); input.value = ''; clear.hidden = true; commit(); input.focus() }, { signal: listeners.signal })
 })
 document.querySelectorAll<HTMLElement>('[data-category-box]').forEach(root => {
  if (root.dataset.initialized) return
  root.dataset.initialized = 'true'
  root.querySelectorAll<HTMLInputElement>('input[type=checkbox]').forEach(input => input.addEventListener('change', () => {
   const previous = read().categories
   addSearchParamsToUrl({ categories: input.checked ? [...previous, input.value] : previous.filter(value => value !== input.value) }); update()
  }))
  root.querySelector<HTMLInputElement>('input[type=search]')?.addEventListener('input', event => {
   const query = (event.target as HTMLInputElement).value.toLowerCase()
   root.querySelectorAll<HTMLElement>('[data-category-option]').forEach(option => option.hidden = !option.textContent?.toLowerCase().includes(query))
  })
 })
 update()
 if (!bound) { window.addEventListener('popstate', update); bound = true }
}
