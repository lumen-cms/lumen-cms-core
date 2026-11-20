// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest'
import { initializeStoryblokPreview } from '../../packages/lumen-cms-astro/src/client/storyblokPreview'
import { createLivePreviewHandler } from '../../packages/lumen-cms-astro/node_modules/@storyblok/live-preview/dist/index.mjs'
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
it('paints raw input immediately and cancels an older render during debounce', async () => {
 setup()
 const element = document.createElement('div')
 element.dataset.lmRichtext = 'rich'
 element.innerHTML = '<p>Initial</p>'
 document.body.append(element)
 let resolve!: (response: Response) => void
 const fetcher = vi.fn().mockReturnValueOnce(new Promise(done => { resolve = done })).mockReturnValue(new Promise(() => {}))
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
 expect(document.querySelector('section')?.className).toBe('old')
 expect(appended[0].src).toMatch(/\/new-widget.js$/)
 appended[0].dispatchEvent(new Event('load'))
 await vi.waitFor(() => expect(mounted).toHaveBeenCalledTimes(1))
 vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(html.replace('</body>', '<script type="module" src="/new-widget.js"></script></body>'))))
 document.addEventListener('astro:page-load', mounted, { once: true })
 input()
 await vi.waitFor(() => expect(mounted).toHaveBeenCalledTimes(2))
 expect(appended).toHaveLength(1)
})

it('keeps widgets alive while a new module loads and commits only the latest edit', async () => {
 setup()
 const old = document.querySelector('section')!
 const cleanup = vi.fn(), mounted = vi.fn()
 onUnmount(old, cleanup)
 document.addEventListener('astro:page-load', mounted, { once: true })
 const appended: HTMLScriptElement[] = []
 const append = document.head.append.bind(document.head)
 vi.spyOn(document.head, 'append').mockImplementation((...nodes) => {
  for (const node of nodes) {
   if (node instanceof HTMLScriptElement) appended.push(node)
   else append(node)
  }
 })
 const withModule = (title: string) => html.replace('Edited', title).replace('</body>', '<script type="module" src="/shared-new-widget.js"></script></body>')
 vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(new Response(withModule('Stale'))).mockResolvedValueOnce(new Response(withModule('Latest'))))
 input()
 await vi.waitFor(() => expect(appended).toHaveLength(1))
 input()
 await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(2))
 expect(cleanup).not.toHaveBeenCalled()
 expect(document.body.contains(old)).toBe(true)
 appended[0].dispatchEvent(new Event('load'))
 await vi.waitFor(() => expect(mounted).toHaveBeenCalledOnce())
 expect(appended).toHaveLength(1)
 expect(cleanup).toHaveBeenCalledOnce()
 expect(document.body.contains(old)).toBe(false)
 expect(document.title).toBe('Latest')
})
it('keeps the current widgets usable when a new module fails, and retries on the next edit', async () => {
 setup()
 const old = document.querySelector('section')!, cleanup = vi.fn()
 onUnmount(old, cleanup)
 vi.spyOn(console, 'error').mockImplementation(() => {})
 const appended: HTMLScriptElement[] = []
 const append = document.head.append.bind(document.head)
 vi.spyOn(document.head, 'append').mockImplementation((...nodes) => {
  for (const node of nodes) {
   if (node instanceof HTMLScriptElement) appended.push(node)
   else append(node)
  }
 })
 const response = html.replace('</body>', '<script type="module" src="/retry-widget.js"></script></body>')
 vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => new Response(response)))
 const error = vi.fn()
 document.addEventListener('lumen:preview-error', error, { once: true })
 input()
 await vi.waitFor(() => expect(appended).toHaveLength(1))
 appended[0].dispatchEvent(new Event('error'))
 await vi.waitFor(() => expect(error).toHaveBeenCalledOnce())
 expect(cleanup).not.toHaveBeenCalled()
 expect(document.body.contains(old)).toBe(true)
 input()
 await vi.waitFor(() => expect(appended).toHaveLength(2))
 appended[1].dispatchEvent(new Event('load'))
 await vi.waitFor(() => expect(cleanup).toHaveBeenCalledOnce())
})

it('uses the SDK default to coalesce typing into one latest-payload render after 500ms, and cancels queued work on disposal', async () => {
 setup()
 vi.useFakeTimers()
 const fetcher = vi.fn().mockReturnValue(new Promise(() => {}))
 vi.stubGlobal('fetch', fetcher)
 // Exercise the SDK's public scheduler and cancelable Astro update contract.
 const sdkUpdate = vi.fn()
 const handler = createLivePreviewHandler({
  currentRoot: () => document.body, update: sdkUpdate,
  onBeforeUpdate: story => document.dispatchEvent(new CustomEvent('storyblok-live-preview-updating', { cancelable: true, detail: { story } })),
 })
 const raw = (title: string) => {
  const story = { id: 1, uuid: 'fixture', content: { title } }
  document.dispatchEvent(new CustomEvent('lumen:preview-input', { detail: { story } }))
  void handler.handle({ action: 'input', story })
 }
 try {
  raw('A')
  await vi.advanceTimersByTimeAsync(200)
  raw('AB')
  await vi.advanceTimersByTimeAsync(200)
  raw('ABC')
  await vi.advanceTimersByTimeAsync(499)
  expect(fetcher).not.toHaveBeenCalled()
  await vi.advanceTimersByTimeAsync(1)
  expect(fetcher).toHaveBeenCalledOnce()
  expect(JSON.parse(fetcher.mock.calls[0][1].body).story.content.title).toBe('ABC')
  raw('ABCD')
  expect(fetcher.mock.calls[0][1].signal.aborted).toBe(true)
  dispose()
  handler.dispose()
  await vi.advanceTimersByTimeAsync(1000)
  expect(fetcher).toHaveBeenCalledOnce()
  expect(sdkUpdate).not.toHaveBeenCalled()
 } finally { handler.dispose(); vi.useRealTimers() }
})

it('keeps the SDK preview element connected and ignores its replacement from server HTML', async () => {
 setup()
 const disconnected = vi.fn()
 if (!customElements.get('storyblok-preview')) customElements.define('storyblok-preview', class extends HTMLElement { disconnectedCallback() { disconnected() } })
 const preview = document.createElement('storyblok-preview')
 document.body.append(preview)
 vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(html.replace('</body>', '<storyblok-preview></storyblok-preview></body>'))))
 input()
 await vi.waitFor(() => expect(document.title).toBe('Edited'))
 expect(document.querySelectorAll('storyblok-preview')).toHaveLength(1)
 expect(document.querySelector('storyblok-preview')).toBe(preview)
 expect(disconnected).not.toHaveBeenCalled()
})
