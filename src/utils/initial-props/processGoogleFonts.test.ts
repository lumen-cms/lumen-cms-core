import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadGoogleFontsCss } from './processGoogleFonts'
import { clearGoogleFontsCss, getGoogleFontsCss } from './googleFontsCache'
import { getFontBasedOnSetting } from '../parseFont'

const settings = { theme_font_default: 'Inter:wght@400' }
const href = getFontBasedOnSetting(settings)
const googleCss = `/* latin */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/inter/v1/inter.woff2) format('woff2');
}`

describe('loadGoogleFontsCss', () => {
  afterEach(() => {
    clearGoogleFontsCss()
  })

  it('fetches, minifies and caches the css', async () => {
    const fetchMock = vi.fn(async () => new Response(googleCss))
    vi.stubGlobal('fetch', fetchMock)

    const css = await loadGoogleFontsCss(settings)

    expect(css).toContain('@font-face{font-family:')
    expect(css).not.toContain('/* latin */')
    expect(getGoogleFontsCss(href)).toBe(css)
    expect(fetchMock).toHaveBeenCalledWith(
      href,
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    )

    await loadGoogleFontsCss(settings)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('returns undefined without throwing when Google fails', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('', { status: 500 }))
    )

    await expect(loadGoogleFontsCss(settings)).resolves.toBeUndefined()
    expect(getGoogleFontsCss(href)).toBeUndefined()
  })

  it('returns undefined when the request times out', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new DOMException('The operation timed out.', 'TimeoutError')
      })
    )

    await expect(loadGoogleFontsCss(settings)).resolves.toBeUndefined()
  })

  it('skips fetching when Google fonts are disabled', async () => {
    vi.stubEnv('NEXT_PUBLIC_DISABLE_GOOGLE_FONTS', 'true')
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(loadGoogleFontsCss(settings)).resolves.toBeUndefined()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
