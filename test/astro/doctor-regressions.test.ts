import { afterEach, expect, it, vi } from 'vitest'
import { ALL as previewEndpoint } from '../../packages/lumen-cms-astro/src-server/pages/api/preview'
import { configureLinkRedirects, resolveLinkRedirect } from '../../packages/lumen-cms-astro/src/lib/links'
import { getDateFormatIntlOption } from '../../packages/lumen-cms-shared/src/core/utils/intlDateHelper'

afterEach(() => { vi.unstubAllEnvs(); configureLinkRedirects([]) })

it('fails closed when the legacy preview service has no configured secret', async () => {
 vi.stubEnv('LUMEN_PREVIEW_SECRET', '')
 const session = { set: vi.fn(), regenerate: vi.fn(), delete: vi.fn() }
 const response = await previewEndpoint({ url: new URL('https://example.test/api/preview?secret=lm-qrxswkwkwkw'), session } as never)
 expect(response.status).toBe(503)
 expect(response.headers.get('cache-control')).toBe('private, no-store')
 expect(session.regenerate).not.toHaveBeenCalled()
 expect(session.set).not.toHaveBeenCalled()
})

it('keeps malformed origins and redirect destinations from crashing page rendering', () => {
 vi.stubEnv('LUMEN_SITE_URL', 'https://example.test')
 vi.stubEnv('LUMEN_LINK_REDIRECTS', '{}')
 configureLinkRedirects([['/old', 'http://[invalid']])
 expect(resolveLinkRedirect('/old?ref=nav#section')).toBe('/old?ref=nav#section')
 vi.stubEnv('LUMEN_SITE_URL', 'http://[invalid')
 expect(resolveLinkRedirect('/old')).toBe('/old')
})

it.each(['null', '[]', '{', '{"/old":null}', '{"/old":{"destination":7}}'])('reports malformed redirect configuration %s clearly', value => {
 vi.stubEnv('LUMEN_SITE_URL', 'https://example.test')
 vi.stubEnv('LUMEN_LINK_REDIRECTS', value)
 expect(() => resolveLinkRedirect('/old')).toThrow('LUMEN_LINK_REDIRECTS must contain a JSON object')
})

it('does not mutate reusable CMS date format options', () => {
 const options = { hide_time: true, year: 'numeric' as const }
 expect(getDateFormatIntlOption(options)).toMatchObject({ year: 'numeric' })
 expect(getDateFormatIntlOption(options)).not.toHaveProperty('hide_time')
 expect(options.hide_time).toBe(true)
})
