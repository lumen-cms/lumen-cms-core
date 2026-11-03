// Document-owned scripts are shared by mounted components and survive dialog closes.
const scripts = new Map<string, Promise<void>>()
export function loadExternalScript(source: string, attributes?: Record<string, string>): Promise<void> {
 const url = new URL(source, document.baseURI).href
 const existing = scripts.get(url)
 if (existing) return existing
 const script = document.createElement('script')
 script.src = url; script.async = true
 for (const [name, value] of Object.entries(attributes || {})) script.setAttribute(name, value)
 const ready = new Promise<void>((resolve, reject) => {
  script.addEventListener('load', () => resolve(), { once: true })
  script.addEventListener('error', () => { scripts.delete(url); script.remove(); reject(new Error(`Unable to load ${url}`)) }, { once: true })
 })
 scripts.set(url, ready)
 document.head.append(script)
 return ready
}
