import { expect, it, vi } from 'vitest'
import { feedResponse } from '../../packages/lumen-cms-shared/src/server/feed'
it('preserves tag filters, item order, metadata, date fallback and latest date', async () => {
 const loadStories = vi.fn(async () => [
  { full_slug: 'older', name: 'Older', published_at: '2026-10-01', content: { meta_description: 'Summary' } },
  { full_slug: 'newer', name: 'Newer', created_at: '2026-11-01', content: {} },
 ])
 const response = await feedResponse(new Request('https://fixture.test/api/feed/a/b'), 'a/b', { loadStories, loadSettings: async () => ({ website_title: 'Fixture feed', seo_description: 'Fixture description' }) })
 expect(loadStories).toHaveBeenCalledWith({ excluding_fields: 'body,right_body,property,seo_body', with_tag: 'a,b' })
 expect(response.headers.get('Content-Type')).toBe('text/xml')
 const body = await response.text()
 expect(body).toContain('<lastBuildDate>2026-11-01</lastBuildDate>')
 expect(body).toContain('<link>fixture.test/older</link>')
 expect(body).toContain('<pubDate>2026-11-01</pubDate>')
 expect(body).toContain('<content:encoded><![CDATA[[object Object]]]></content:encoded>')
 expect(body.indexOf('Older')).toBeLessThan(body.indexOf('Newer'))
})
it('escapes XML and safely splits embedded CDATA terminators', async () => {
 const response = await feedResponse(new Request('https://fixture.test/api/feed/a'), 'a', { loadStories: async () => [{ name: 'A ]]> B', full_slug: 'course?a=1&b=2' }], loadSettings: async () => ({ website_title: 'Feed < & >' }) })
 const body = await response.text()
 expect(body).toContain('course?a=1&amp;b=2')
 expect(body).toContain('<![CDATA[A ]]]]><![CDATA[> B]]>')
 expect(body).toContain('<![CDATA[Feed < & >]]>')
})
it('propagates delivery errors to the server route instead of emitting a partial feed', async () => {
 await expect(feedResponse(new Request('https://fixture.test/api/feed/a'), 'a', { loadStories: async () => [], loadSettings: async () => { throw new Error('Missing settings') } })).rejects.toThrow('Missing settings')
})
