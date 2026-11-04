import type { CmsScript } from 'lumen-cms-shared/scripts'

const scheduled = new Set<string>()
const sources = new Set<string>()
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
    if (document.readyState === 'complete') idle()
    else window.addEventListener('load', idle, { once: true })
   } else insert()
  })
 })
}
