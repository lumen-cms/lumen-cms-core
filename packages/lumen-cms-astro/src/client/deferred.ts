import { onUnmount } from './lifecycle'

type Mount = (root: HTMLElement, signal: AbortSignal) => void | (() => void) | Promise<void | (() => void)>
const pending = new WeakSet<HTMLElement>()
/** Keep server HTML; enhance near the viewport, with cancellation and retry. */
export function initializeDeferred(selector: string, load: () => Promise<{ mount: Mount }>) {
 document.querySelectorAll<HTMLElement>(selector).forEach(root => {
  if (pending.has(root)) return
  pending.add(root)
  const lifetime = new AbortController()
  let observer: IntersectionObserver | undefined, dispose: void | (() => void), loading = false, ready = false
  let status: HTMLElement | undefined
  root.dataset.deferredState = 'pending'
  const activate = async () => {
   if (loading || ready || lifetime.signal.aborted) return
   loading = true; root.dataset.deferredState = 'loading'; root.setAttribute('aria-busy', 'true'); status?.remove()
   try {
    const enhancement = await load()
    if (lifetime.signal.aborted || !root.isConnected) return
    const cleanup = await enhancement.mount(root, lifetime.signal)
    if (lifetime.signal.aborted || !root.isConnected) { cleanup?.(); return }
    dispose = cleanup; ready = true; observer?.disconnect(); root.dataset.deferredState = 'ready'
   } catch {
    if (lifetime.signal.aborted) return
    root.dataset.deferredState = 'error'
    status = document.createElement('div'); status.setAttribute('role', 'alert')
    const retry = document.createElement('button'); retry.type = 'button'; retry.className = 'btn btn-sm'; retry.textContent = 'Retry loading'
    retry.addEventListener('click', () => { void activate() }, { signal: lifetime.signal })
    status.append('Unable to load this component. ', retry); root.append(status)
   } finally {
    loading = false
    if (!lifetime.signal.aborted) root.removeAttribute('aria-busy')
   }
  }
  root.addEventListener('focusin', () => { void activate() }, { signal: lifetime.signal })
  onUnmount(root, () => { lifetime.abort(); observer?.disconnect(); dispose?.(); status?.remove(); pending.delete(root); delete root.dataset.deferredState; root.removeAttribute('aria-busy') })
  const rect = root.getBoundingClientRect()
  if (!('IntersectionObserver' in window) || rect.bottom >= -400 && rect.top <= innerHeight + 400 && rect.right >= 0 && rect.left <= innerWidth) void activate()
  else { observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) void activate() }, { rootMargin: '400px 0px' }); observer.observe(root) }
 })
}
