// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest'
import { fetchRenderedStories, mountRenderedStories } from '../../packages/lumen-cms-astro/src/client/storyListEndpoint'
import { onUnmount } from '../../packages/lumen-cms-astro/src/client/lifecycle'
afterEach(() => { document.dispatchEvent(new Event('astro:before-swap')); document.body.replaceChildren(); vi.unstubAllGlobals() })
it('requests same-origin results with the current path and repeated filters', async () => {
 vi.stubGlobal('location', new URL('https://fixture.test/de/page?ignored=1'))
 const fetcher = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => new Response(JSON.stringify({ html: '<p>Result</p>', total: 3, count: 1 })))
 vi.stubGlobal('fetch', fetcher)
 await fetchRenderedStories('/api/lists', 'list-42', 2, 'a & b', ['one', 'two'])
 const url = fetcher.mock.calls[0][0] as unknown as URL
 expect(url.origin).toBe('https://fixture.test')
 expect(Object.fromEntries(url.searchParams)).toMatchObject({ source: '/de/page', list: 'list-42', page: '2', search__text: 'a & b' })
 expect(url.searchParams.getAll('search__categories')).toEqual(['one', 'two'])
 await expect(fetchRenderedStories('https://other.test/api', 'list-42', 1, '', [])).rejects.toThrow('same-origin')
 expect(fetcher).toHaveBeenCalledTimes(1)
})
it('rejects failed and malformed responses without mounting their HTML', async () => {
 vi.stubGlobal('location', new URL('https://fixture.test/page'))
 vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 503 })))
 await expect(fetchRenderedStories('/api/lists', 'list', 1, '', [])).rejects.toThrow('503')
 vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ html: '<p>Invalid</p>', total: -1, count: 1 }))))
 await expect(fetchRenderedStories('/api/lists', 'list', 1, '', [])).rejects.toThrow('Invalid')
})
it('unmounts previous controls before mounting arbitrary replacement markup', () => {
 document.body.innerHTML = '<main><div><button>Old</button></div></main>'
 const destination = document.querySelector('div')!
 const events: string[] = []
 onUnmount(destination.querySelector('button')!, () => events.push('unmount'))
 destination.addEventListener('lumen:content-mounted', () => events.push(`mount:${destination.textContent}`))
 mountRenderedStories(destination, { html: '<section><strong>New</strong></section>', total: 1, count: 1 })
 expect(events).toEqual(['unmount', 'mount:New'])
 expect(destination.hidden).toBe(false)
 mountRenderedStories(destination, { html: '', total: 0, count: 0 })
 expect(destination.hidden).toBe(true)
})
