import type { CmsScript } from 'lumen-cms-shared/scripts'

const scheduled = new Set<string>()
const sources = new Set<string>()
let initialPaint: Promise<void> | undefined
/** load/idle alone can run before the loaded hero is decoded and painted. */
function afterInitialPaint() {
 return initialPaint ||= new Promise<void>(resolve => {
  const loaded = async () => {
   // Only eager priority images: never wait for below-the-fold lazy assets.
   await Promise.allSettled([...document.querySelectorAll<HTMLImageElement>('img[fetchpriority="high"]')]
    .filter(image => image.loading !== 'lazy')
    .map(image => image.decode()))
   if (document.visibilityState === 'hidden') { resolve(); return }
   // The second frame follows a rendering opportunity. A backgrounded tab
   // must still initialize analytics even when rAF is suspended.
   let done = false
   const finish = () => { if (done) return; done = true; clearTimeout(fallback); resolve() }
   const fallback = setTimeout(finish, 1000)
   requestAnimationFrame(() => requestAnimationFrame(finish))
  }
  if (document.readyState === 'complete') void loaded()
  else window.addEventListener('load', () => { void loaded() }, { once: true })
 })
}
export function initializeCmsScripts() {
 document.querySelectorAll<HTMLScriptElement>('script[data-lm-cms-script]').forEach(script => {
  scheduled.add(script.dataset.lmCmsScript!)
  if (script.src) sources.add(script.src)
 })
 document.querySelectorAll<HTMLScriptElement>('script[data-lm-cms-scripts]').forEach(config => {
  const entries: CmsScript[] = JSON.parse(config.textContent || '[]')
  entries.forEach(entry => {
   const id = entry.attributes.id || entry.id
   if (scheduled.has(id)) return
   scheduled.add(id)
   const insert = () => {
    const script = document.createElement('script')
    script.id = entry.id
    if (entry.src) { script.src = entry.src; script.async = true }
    else script.textContent = entry.body || ''
    for (const [key, value] of Object.entries(entry.attributes)) script.setAttribute(key, value)
    if (script.src && sources.has(script.src)) return
    if (script.src) sources.add(script.src)
    script.dataset.lmCmsScript = id
    script.addEventListener('error', () => {
     scheduled.delete(id); sources.delete(script.src); script.remove()
     document.dispatchEvent(new CustomEvent('lumen:script-error', { detail: { id, src: script.src } }))
    }, { once: true })
    document.body.append(script)
   }
   const idle = () => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(insert, { timeout: 2000 })
    else setTimeout(insert, 1)
   }
   if (entry.strategy === 'lazyOnload') {
    void afterInitialPaint().then(idle)
   } else insert()
  })
 })
}
