import { expect, it } from 'vitest'
import { onRequest } from '../../packages/lumen-cms-astro/src/server/noindex'
it.each([200, 302, 401, 404, 500])('excludes SSR status %s without requiring a preview cookie', async status => {
 const response = await onRequest({} as never, async () => new Response('body', { status, headers: { 'X-Custom': 'kept', 'X-Robots-Tag': 'index' } }))
 expect(response.headers.get('X-Robots-Tag')).toBe('noindex, nofollow')
 expect(response.headers.get('X-Custom')).toBe('kept')
 expect(response.status).toBe(status)
 expect(await response.text()).toBe('body')
})
