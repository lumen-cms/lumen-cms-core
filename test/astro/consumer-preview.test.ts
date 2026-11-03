import { afterEach, expect, it, vi } from 'vitest'
import { enterConsumerPreview, exitConsumerPreview, isPreviewRequest, pageOptions } from '../../packages/lumen-cms-astro/src/server/request'

afterEach(() => { vi.unstubAllEnvs(); vi.useRealTimers() })
function cookies() {
 const values = new Map<string, string>()
 return { get: (key: string) => values.has(key) ? { value: values.get(key)! } : undefined, set: vi.fn((key: string, value: string) => values.set(key, value)), delete: vi.fn((key: string) => values.delete(key)) }
}
const secret = 'consumer-preview-test-secret-32-characters'
it('rejects missing/weak credentials and duplicate secrets before setting a session', async () => {
 const jar = cookies()
 const context = { cookies: jar, url: new URL('https://example.test/api/preview') }
 expect((await enterConsumerPreview(context as never)).status).toBe(503)
 vi.stubEnv('LUMEN_PREVIEW_SECRET', secret)
 vi.stubEnv('STORYBLOK_PREVIEW_TOKEN', 'private-draft-token')
 context.url.search = `secret=${secret}&secret=${secret}`
 expect((await enterConsumerPreview(context as never)).status).toBe(401)
 expect(jar.set).not.toHaveBeenCalled()
})
it('authenticates a signed session across instances and rejects tampering, expiry and key rotation', async () => {
 vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-03T00:00:00Z'))
 vi.stubEnv('LUMEN_PREVIEW_SECRET', secret)
 vi.stubEnv('STORYBLOK_PREVIEW_TOKEN', 'private-draft-token')
 const jar = cookies()
 const url = new URL(`https://example.test/api/preview?secret=${secret}&slug=de/example&_storyblok_release=42`)
 const response = await enterConsumerPreview({ url, cookies: jar } as never)
 expect(response.status).toBe(307)
 expect(response.headers.get('location')).toBe('/de/example?_storyblok_release=42')
 expect(response.headers.get('cache-control')).toBe('private, no-store')
 expect(jar.set.mock.calls[0][2]).toMatchObject({ httpOnly: true, secure: true, sameSite: 'none', path: '/' })
 expect(isPreviewRequest(jar as never)).toBe(true)
 expect(isPreviewRequest(jar as never, secret + 'rotated')).toBe(false)
 const original = jar.get('lumen_preview_auth')!.value
 jar.set('lumen_preview_auth', original.replace(/^\d/, '9'))
 expect(isPreviewRequest(jar as never)).toBe(false)
 jar.set('lumen_preview_auth', original)
 vi.advanceTimersByTime(8 * 60 * 60 * 1000 + 1)
 expect(isPreviewRequest(jar as never)).toBe(false)
})
it('clears preview and keeps the redirect on the consumer origin', async () => {
 const jar = cookies(); jar.set('lumen_preview_auth', 'old')
 const response = await exitConsumerPreview({ cookies: jar, url: new URL('https://example.test/api/exit-preview?slug=//evil.test') } as never)
 expect(response.headers.get('location')).toBe('/evil.test')
 expect(isPreviewRequest(jar as never)).toBe(false)
})
it('resolves site locales without requiring the core checkout', () => {
 vi.stubEnv('LUMEN_LOCALES', 'en,de,id')
 expect(pageOptions('id/kontak')).toMatchObject({ locale: 'id', defaultLocale: 'en' })
 expect(pageOptions()).toMatchObject({ locale: 'en', cmsSlug: 'home' })
})
