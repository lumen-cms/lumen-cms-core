import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { loadGoogleFontsCss } from '../../packages/lumen-cms-shared/src/core/utils/initial-props/processGoogleFonts'
import { clearGoogleFontsCss } from '../../packages/lumen-cms-shared/src/core/utils/initial-props/googleFontsCache'

beforeEach(() => {
  clearGoogleFontsCss()
  vi.stubEnv('PUBLIC_DISABLE_GOOGLE_FONTS', '')
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

it('shares a pending font fetch across renders and reuses completed CSS', async () => {
  const response = Promise.withResolvers<Response>()
  const fetch = vi.fn(() => response.promise)
  vi.stubGlobal('fetch', fetch)
  const renders = Array.from({ length: 10 }, () => loadGoogleFontsCss({}))
  expect(fetch).toHaveBeenCalledOnce()
  response.resolve(new Response('font CSS'))
  expect(await Promise.all(renders)).toEqual(Array(10).fill('font CSS'))
  expect(await loadGoogleFontsCss({})).toBe('font CSS')
  expect(fetch).toHaveBeenCalledOnce()
})

it.each(['network', 'http'])('allows retry after a shared %s failure', async failure => {
  const response = Promise.withResolvers<Response>()
  const fetch = vi.fn().mockReturnValueOnce(response.promise)
    .mockResolvedValue(new Response('retry CSS'))
  vi.stubGlobal('fetch', fetch)
  const warning = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const renders = [loadGoogleFontsCss({}), loadGoogleFontsCss({})]
  if (failure === 'network') response.reject(new Error('offline'))
  else response.resolve(new Response('', { status: 503 }))
  expect(await Promise.all(renders)).toEqual([undefined, undefined])
  expect(warning).toHaveBeenCalledOnce()
  expect(await loadGoogleFontsCss({})).toBe('retry CSS')
  expect(fetch).toHaveBeenCalledTimes(2)
})

it('keeps different font URLs independent', async () => {
  const response = Promise.withResolvers<Response>()
  const fetch = vi.fn(() => response.promise.then(value => value.clone()))
  vi.stubGlobal('fetch', fetch)
  const renders = [loadGoogleFontsCss({ theme_font_default: 'Roboto' }), loadGoogleFontsCss({ theme_font_default: 'Lato' })]
  expect(fetch).toHaveBeenCalledTimes(2)
  response.resolve(new Response('font CSS'))
  expect(await Promise.all(renders)).toEqual(['font CSS', 'font CSS'])
})
