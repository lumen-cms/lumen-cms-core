import { initializeStoryblokEditable } from './storyblokEditable'
import { updateRichTextPreview } from './richTextPreview'
/** Debounce server reconciliation while painting supported rich text immediately. Keep the SDK payload protocol, while
 * replacing server-owned styles/attributes and remounting native controls.
 * Also handle the SDK's cancelable update event for integrations using it. */
export function initializeStoryblokPreview() {
 if (!document.documentElement.hasAttribute('data-lumen-preview')) return () => {}
 initializeStoryblokEditable()
 document.addEventListener('lumen:content-mounted', initializeStoryblokEditable)
 let pending: AbortController | undefined
 const scripts = new Set(Array.from(document.querySelectorAll<HTMLScriptElement>('script[src]'), script => script.src))
 const modules = new Map<string, Promise<void>>()
 const update = async (event: Event) => {
  const story = (event as CustomEvent).detail?.story
  if (!story) return
  event.preventDefault()
  pending?.abort()
  updateRichTextPreview(story.content)
  const request = pending = new AbortController()
  try {
   // Preserve the official SDK's StoryblokServerData/getPayload round trip
   // while retaining the CMS head/style and widget lifecycle update behavior.
   const serialized = document.getElementById('__STORYBLOK_SERVERDATA__')?.textContent
   const serverData = serialized ? JSON.parse(serialized) : undefined
   const response = await fetch(location.href, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ story: { ...story, is_storyblok_preview: true }, serverData }),
    signal: request.signal,
   })
   if (!response.ok) throw new Error(`Preview render failed: ${response.status}`)
   const next = new DOMParser().parseFromString(await response.text(), 'text/html')
   if (request.signal.aborted) return
   if (!next.documentElement.hasAttribute('data-lumen-preview')) throw new Error('Preview response is not a CMS document')
   const newScripts = [...new Set(Array.from(next.querySelectorAll<HTMLScriptElement>('script[type="module"][src]'), script => new URL(script.getAttribute('src')!, location.href).href))].filter(src => !scripts.has(src))
   // Load dependencies before disposing the current page. Superseding input or
   // a failed module must never leave a swapped body with uninitialized widgets.
   await Promise.all(newScripts.map(src => {
    let loading = modules.get(src)
    if (!loading) {
     loading = new Promise<void>((resolve, reject) => {
      const active = document.createElement('script')
      active.type = 'module'; active.src = src
      active.onload = () => { scripts.add(src); resolve() }
      active.onerror = () => { modules.delete(src); active.remove(); reject(new Error(`Preview module failed: ${src}`)) }
      document.head.append(active)
     })
     modules.set(src, loading)
    }
    return loading
   }))
   if (request.signal.aborted) return
   const scroll = { left: window.scrollX, top: window.scrollY }
   document.dispatchEvent(new Event('astro:before-swap'))
   // Replace all server-owned theme/font/custom CSS, including deleted settings.
   document.head.querySelectorAll('[data-lumen-preview-head]').forEach(node => node.remove())
   next.head.querySelectorAll('[data-lumen-preview-head]').forEach(node => document.head.append(document.importNode(node, true)))
   // Newly added component types can introduce additional bundled stylesheets.
   next.head.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]:not([data-lumen-preview-head])').forEach(link => {
    const href = new URL(link.getAttribute('href')!, location.href).href
    if (!Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')).some(current => current.href === href)) document.head.append(document.importNode(link, true))
   })
   // Keep JSON configuration scripts, but activate executable modules ourselves.
   next.body.querySelectorAll('script:not([type]), script[type="module"], script[type="text/javascript"]').forEach(script => script.remove())
   const body = document.importNode(next.body, true)
   // The official Bridge holds references to these editor controls. Preserve
   // them across reconciliation so block selection keeps working after typing.
   const controls = ['storyblok__hint', 'storyblok__highlight', 'storyblok__overlay', 'storyblok__overlay-menu', 'storyblok__field-overlay']
   // Keep the SDK custom element connected: disconnecting it disposes its
   // scheduler and Bridge subscription, potentially losing the next input.
   for (const child of Array.from(document.body.childNodes)) {
    if (child instanceof Element && (child.matches('storyblok-preview') || controls.some(name => child.classList.contains(name)))) continue
    child.remove()
   }
   body.querySelectorAll('storyblok-preview').forEach(node => node.remove())
   for (const attribute of Array.from(document.body.attributes)) document.body.removeAttribute(attribute.name)
   for (const attribute of Array.from(body.attributes)) document.body.setAttribute(attribute.name, attribute.value)
   document.body.append(...Array.from(body.childNodes))
   document.documentElement.lang = next.documentElement.lang
   document.dispatchEvent(new Event('astro:page-load'))
   initializeStoryblokEditable()
   window.scrollTo(scroll)
   document.dispatchEvent(new CustomEvent('storyblok-live-preview-updated', { detail: { story } }))
  } catch (error) {
   if (!request.signal.aborted) {
    console.error('[lumen-cms] Live preview update failed', error)
    document.dispatchEvent(new CustomEvent('lumen:preview-error', { detail: { error } }))
   }
  }
 }
 // The official SDK owns the 500 ms debounce. Cancel immediately so
 // an earlier response cannot overwrite a newer optimistic edit during typing.
 const input = (event: Event) => {
  pending?.abort()
  const story = (event as CustomEvent).detail?.story
  if (!story) return
  updateRichTextPreview(story.content)
 }
 document.addEventListener('lumen:preview-input', input)
 document.addEventListener('storyblok-live-preview-updating', update)
 return () => {
  pending?.abort()
  document.removeEventListener('lumen:preview-input', input)
  document.removeEventListener('storyblok-live-preview-updating', update)
  document.removeEventListener('lumen:content-mounted', initializeStoryblokEditable)
 }
}
