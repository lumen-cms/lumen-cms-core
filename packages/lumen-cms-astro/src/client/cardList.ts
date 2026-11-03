import { onUnmount } from './lifecycle'

export function initializeCardLists() {
 document.querySelectorAll<HTMLElement>('.lm-card-list:not([data-lm-card-pagination])').forEach(list => {
  const sentinel = [...list.querySelectorAll<HTMLElement>('[data-lm-card-more]')].find(node => node.closest('.lm-card-list') === list)
  if (!sentinel) return
  list.dataset.lmCardPagination = 'true'
  let disposed = false
  const listeners = new AbortController()
  const remaining = () => [...list.querySelectorAll<HTMLElement>('[data-lm-card-page][hidden]:not([data-filtered-out])')].filter(item => item.closest('.lm-card-list') === list)
  const observe = () => {
   observer.unobserve(sentinel)
   if (!disposed && remaining().length) observer.observe(sentinel)
  }
  const observer = new IntersectionObserver(entries => {
   if (disposed || !entries.some(entry => entry.target === sentinel && entry.isIntersecting)) return
   remaining().slice(0, 30).forEach(item => { item.hidden = false })
   observe()
  })
  document.addEventListener('lumen:list-filter', event => {
   if (event.target instanceof Element && event.target.contains(list)) observe()
  }, { signal: listeners.signal })
  onUnmount(list, () => { disposed = true; listeners.abort(); observer.disconnect() })
  observe()
 })
}
