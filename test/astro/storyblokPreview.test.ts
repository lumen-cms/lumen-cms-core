// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest'
import { initializeStoryblokPreview } from '../../packages/lumen-cms-astro/src/client/storyblokPreview'
import { onUnmount } from '../../packages/lumen-cms-astro/src/client/lifecycle'
let dispose = () => {}
afterEach(() => { dispose(); document.head.replaceChildren(); document.body.replaceChildren(); document.documentElement.removeAttribute('data-lumen-preview') })
function setup() {
 document.documentElement.setAttribute('data-lumen-preview', '')
 document.head.innerHTML = '<style data-lumen-preview-head>.old{color:red}</style><style data-lumen-preview-head>.deleted{display:none}</style>'
 document.body.innerHTML = '<section class="old" style="color:red"></section>'
 dispose = initializeStoryblokPreview()
}
function input() {
 const event = new CustomEvent('storyblok-live-preview-updating', { cancelable: true, detail: { story: { uuid: 'page-id', content: {} } } })
 document.dispatchEvent(event)
 return event
}
const html = '<html lang="de" data-lumen-preview><head><title data-lumen-preview-head>Edited</title><style data-lumen-preview-head>@media(min-width:900px){.new{color:blue}}</style></head><body><section class="new" style="color:blue"></section></body></html>'
it('refreshes breakpoint CSS, deleted settings and changed attributes, disposing and remounting widgets', async () => {
 setup()
 const cleanup = vi.fn(), mounted = vi.fn()
 onUnmount(document.querySelector('section')!, cleanup)
 document.addEventListener('astro:page-load', mounted, { once: true })
 const fetcher = vi.fn().mockResolvedValue(new Response(html))
 vi.stubGlobal('fetch', fetcher)
 expect(input().defaultPrevented).toBe(true)
 await vi.waitFor(() => expect(mounted).toHaveBeenCalledTimes(1))
 expect(cleanup).toHaveBeenCalledTimes(1)
 expect(document.head.textContent).toContain('@media(min-width:900px)')
 expect(document.head.textContent).not.toContain('.deleted')
 expect(document.querySelector('section')?.className).toBe('new')
 expect(document.querySelector('section')?.getAttribute('style')).toBe('color:blue')
 expect(document.title).toBe('Edited')
 expect(document.documentElement.lang).toBe('de')
 expect(JSON.parse(fetcher.mock.calls[0][1].body).story.is_storyblok_preview).toBe(true)
})
it('keeps the rendered page intact when the server rejects an update', async () => {
 setup()
 vi.spyOn(console, 'error').mockImplementation(() => {})
 vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Denied', { status: 401 })))
 const error = vi.fn()
 document.addEventListener('lumen:preview-error', error, { once: true })
 input()
 await vi.waitFor(() => expect(error).toHaveBeenCalled())
 expect(document.querySelector('section')?.className).toBe('old')
 expect(document.head.textContent).toContain('.deleted')
})
it('ignores superseded responses even if the transport does not honor cancellation', async () => {
 setup()
 let resolveFirst!: (response: Response) => void
 vi.stubGlobal('fetch', vi.fn().mockReturnValueOnce(new Promise(resolve => { resolveFirst = resolve })).mockResolvedValueOnce(new Response(html)))
 input(); input()
 await vi.waitFor(() => expect(document.title).toBe('Edited'))
 resolveFirst(new Response(html.replaceAll('Edited', 'Stale')))
 await new Promise(resolve => setTimeout(resolve, 0))
 expect(document.title).toBe('Edited')
})
it('does not intercept SDK updates on public documents', () => {
 dispose = initializeStoryblokPreview()
 expect(input().defaultPrevented).toBe(false)
})
it('paints raw input immediately and cancels an older render before the SDK debounce fires', async () => {
 setup()
 const element = document.createElement('div')
 element.dataset.lmRichtext = 'rich'
 element.innerHTML = '<p>Initial</p>'
 document.body.append(element)
 let resolve!: (response: Response) => void
 const fetcher = vi.fn().mockReturnValue(new Promise(done => { resolve = done }))
 vi.stubGlobal('fetch', fetcher)
 input()
 const story = { content: { body: [{ component: 'rich_text_editor', _uid: 'rich', body: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Instant' }] }] } }] } }
 document.dispatchEvent(new CustomEvent('lumen:preview-input', { detail: { story } }))
 expect(element.textContent).toBe('Instant')
 expect(fetcher).toHaveBeenCalledOnce()
 expect(fetcher.mock.calls[0][1].signal.aborted).toBe(true)
 resolve(new Response(html))
 await new Promise(done => setTimeout(done, 0))
 expect(document.body.contains(element)).toBe(true)
 expect(element.textContent).toBe('Instant')
})
it('round-trips StoryblokServerData and uses the replacement payload on subsequent edits', async () => {
 setup()
 const data = { shopify: { scope: 'fixture', products: [] } }
 const script = document.createElement('script')
 script.id = '__STORYBLOK_SERVERDATA__'; script.type = 'application/json'; script.textContent = JSON.stringify(data)
 document.body.append(script)
 const nextData = { shopify: { scope: 'updated', products: [] } }
 const response = html.replace('</body>', `<script id="__STORYBLOK_SERVERDATA__" type="application/json">${JSON.stringify(nextData)}</script></body>`)
 const fetcher = vi.fn().mockResolvedValue(new Response(response))
 vi.stubGlobal('fetch', fetcher)
 input()
 await vi.waitFor(() => expect(document.title).toBe('Edited'))
 expect(JSON.parse(fetcher.mock.calls[0][1].body).serverData).toEqual(data)
 fetcher.mockResolvedValue(new Response(response))
 input()
 await vi.waitFor(() => expect(fetcher).toHaveBeenCalledTimes(2))
 expect(JSON.parse(fetcher.mock.calls[1][1].body).serverData).toEqual(nextData)
})
it('preserves the official Bridge overlay nodes across server reconciliation', async () => {
 setup()
 const overlay = document.createElement('div')
 overlay.className = 'storyblok__overlay'
 document.body.append(overlay)
 vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(html)))
 input()
 await vi.waitFor(() => expect(document.title).toBe('Edited'))
 expect(document.querySelector('.storyblok__overlay')).toBe(overlay)
})
it('loads newly introduced widget modules once and remounts after they load', async () => {
 setup()
 const appended: HTMLScriptElement[] = []
 const append = document.head.append.bind(document.head)
 vi.spyOn(document.head, 'append').mockImplementation((...nodes) => {
  for (const node of nodes) {
   if (node instanceof HTMLScriptElement) appended.push(node)
   else append(node)
  }
 })
 vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(html.replace('</body>', '<script type="module" src="/new-widget.js"></script></body>'))))
 const mounted = vi.fn()
 document.addEventListener('astro:page-load', mounted, { once: true })
 input()
 await vi.waitFor(() => expect(appended).toHaveLength(1))
 expect(mounted).not.toHaveBeenCalled()
 expect(appended[0].src).toMatch(/\/new-widget.js$/)
 appended[0].dispatchEvent(new Event('load'))
 await vi.waitFor(() => expect(mounted).toHaveBeenCalledTimes(1))
 vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(html.replace('</body>', '<script type="module" src="/new-widget.js"></script></body>'))))
 document.addEventListener('astro:page-load', mounted, { once: true })
 input()
 await vi.waitFor(() => expect(mounted).toHaveBeenCalledTimes(2))
 expect(appended).toHaveLength(1)
})
