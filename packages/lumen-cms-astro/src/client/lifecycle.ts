/** Dispose controls both on page navigation and when a containing dialog unmounts. */
export function onUnmount(root: HTMLElement, dispose: () => void) {
 const listeners = new AbortController()
 const cleanup = () => { listeners.abort(); dispose() }
 document.addEventListener('astro:before-swap', cleanup, { once: true, signal: listeners.signal })
 document.addEventListener('lumen:content-unmount', event => {
  if (event.target instanceof Element && event.target.contains(root)) cleanup()
 }, { signal: listeners.signal })
}
