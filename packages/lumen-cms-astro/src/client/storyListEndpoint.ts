export interface RenderedStoryPage { html: string; total: number; count: number }
export async function fetchRenderedStories(endpoint: string, uid: string, page: number, text: string, categories: string[]): Promise<RenderedStoryPage> {
 const url = new URL(endpoint, location.href)
 if (url.origin !== location.origin) throw new Error('Story list render endpoint must be same-origin')
 url.searchParams.set('source', location.pathname)
 url.searchParams.set('list', uid)
 url.searchParams.set('page', String(page))
 url.searchParams.set('search__text', text)
 url.searchParams.delete('search__categories')
 categories.forEach(category => url.searchParams.append('search__categories', category))
 const response = await fetch(url, { headers: { Accept: 'application/json' } })
 if (!response.ok) throw new Error(`Story list render failed: ${response.status}`)
 const data = await response.json() as RenderedStoryPage
 if (typeof data.html !== 'string' || !Number.isSafeInteger(data.total) || data.total < 0 || !Number.isSafeInteger(data.count) || data.count < 0) throw new Error('Invalid story list response')
 return data
}
export function mountRenderedStories(destination: HTMLElement, data: RenderedStoryPage) {
 destination.dispatchEvent(new CustomEvent('lumen:content-unmount', { bubbles: true }))
 const template = document.createElement('template')
 template.innerHTML = data.html
 destination.replaceChildren(template.content)
 destination.hidden = !data.count
 // Astro modules already loaded by the page use the same mounting contract as
 // dialogs/preview. Consumer modules must support it for dynamically added UI.
 destination.dispatchEvent(new CustomEvent('lumen:content-mounted', { bubbles: true }))
}
