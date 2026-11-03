import { expect, it, vi } from 'vitest'
import { enterPreview, exitPreview, previewRedirect, previewSessionKey } from '../../packages/lumen-cms-shared/src/server/preview'
const session = () => ({ set: vi.fn(), delete: vi.fn(), regenerate: vi.fn(async () => {}) })
it('does not establish a preview session for an invalid secret', async () => {
 const state = session()
 const response = await enterPreview(new URL('https://fixture.test/api/preview?secret=wrong'), state, 'fixture-secret')
 expect(response.status).toBe(401); expect(state.regenerate).not.toHaveBeenCalled(); expect(state.set).not.toHaveBeenCalled()
})
it('regenerates the session and preserves preview query parameters in the redirect', async () => {
 const state = session()
 const response = await enterPreview(new URL('https://fixture.test/api/preview?secret=fixture-secret&slug=de/course&_storyblok_release=123&a=x&a=y'), state, 'fixture-secret')
 expect(state.regenerate).toHaveBeenCalledOnce()
 expect(state.set).toHaveBeenCalledWith(previewSessionKey, true)
 expect(response.status).toBe(307)
 expect(response.headers.get('Location')).toBe('/de/course?_storyblok_release=123&a=x%2Cy')
 expect(response.headers.get('Cache-Control')).toBe('private, no-store')
})
it('removes the preview flag without deleting unrelated session state', () => {
 const state = session()
 const response = exitPreview(new URL('https://fixture.test/api/exit-preview?slug=de/course&ignored=true'), state)
 expect(state.delete).toHaveBeenCalledWith(previewSessionKey)
 expect(response.headers.get('Location')).toBe('/de/course')
})
it.each(['//external.test/path', '\\external.test/path', '/\\external.test/path', '\n//external.test/path'])('keeps slug %s redirects on the preview origin', slug => {
 const url = new URL('https://fixture.test/api/preview'); url.searchParams.set('slug', slug)
 expect(new URL(previewRedirect(url, true), url).origin).toBe(url.origin)
})
