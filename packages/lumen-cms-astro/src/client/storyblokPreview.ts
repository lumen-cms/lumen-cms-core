import { initializeStoryblokEditable } from './storyblokEditable'
import { updateRichTextPreview } from './richTextPreview'
/** The SDK's default morph preserves old attributes and updates only the body.
 * CMS styles live in the head, so use its cancelable update event to replace
 * the server-rendered document content and remount our native controls. */
export function initializeStoryblokPreview() {
 if (!document.documentElement.hasAttribute('data-lumen-preview')) return () => {}
 initializeStoryblokEditable()
 document.addEventListener('lumen:content-mounted', initializeStoryblokEditable)
 let pending: AbortController | undefined
 // Raw Bridge input arrives before the SDK's 500 ms debounce. Cancel any
 // older render immediately so it cannot overwrite the text just typed.
 const input = (event: Event) => {
  const disabled = document.querySelector<HTMLMetaElement>('meta[name="storyblok-live-preview"]')?.content
  if (disabled === 'disabled' || disabled === 'false') return
  pending?.abort()
  updateRichTextPreview((event as CustomEvent).detail?.story?.content)
 }
 document.addEventListener('lumen:preview-input', input)
 const scripts = new Set(Array.from(document.querySelectorAll<HTMLScriptElement>('script[src]'), script => script.src))
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
   const newScripts = [...new Set(Array.from(next.querySelectorAll<HTMLScriptElement>('script[type="module"][src]'), script => new URL(script.getAttribute('src')!, location.href).href))].filter(src => !scripts.has(src))
   // Keep JSON configuration scripts, but activate executable modules ourselves.
   next.body.querySelectorAll('script:not([type]), script[type="module"], script[type="text/javascript"]').forEach(script => script.remove())
   const body = document.importNode(next.body, true)
   // The official Bridge holds references to these editor controls. Preserve
   // them across reconciliation so block selection keeps working after typing.
   const controls = ['storyblok__hint', 'storyblok__highlight', 'storyblok__overlay', 'storyblok__overlay-menu', 'storyblok__field-overlay']
   for (const child of Array.from(document.body.children)) {
    if (controls.some(name => child.classList.contains(name))) body.append(child)
   }
   document.body.replaceWith(body)
   document.documentElement.lang = next.documentElement.lang
   // Existing modules retain their document listeners; new modules must execute
   // once so a component added in the editor can register its initializer.
   const loaded = await Promise.allSettled(newScripts.map(src => new Promise<void>((resolve, reject) => {
    const active = document.createElement('script')
    active.type = 'module'; active.src = src
    active.onload = () => { scripts.add(src); resolve() }
    active.onerror = () => reject(new Error(`Preview module failed: ${src}`))
    document.head.append(active)
   })))
   if (request.signal.aborted) return
   document.dispatchEvent(new Event('astro:page-load'))
   initializeStoryblokEditable()
   window.scrollTo(scroll)
   const failed = loaded.find(result => result.status === 'rejected')
   if (failed?.status === 'rejected') throw failed.reason
   document.dispatchEvent(new CustomEvent('storyblok-live-preview-updated', { detail: { story } }))
  } catch (error) {
   if (!request.signal.aborted) {
    console.error('[lumen-cms] Live preview update failed', error)
    document.dispatchEvent(new CustomEvent('lumen:preview-error', { detail: { error } }))
   }
  }
 }
 document.addEventListener('storyblok-live-preview-updating', update)
 return () => {
  pending?.abort()
  document.removeEventListener('lumen:preview-input', input)
  document.removeEventListener('storyblok-live-preview-updating', update)
  document.removeEventListener('lumen:content-mounted', initializeStoryblokEditable)
 }
}
