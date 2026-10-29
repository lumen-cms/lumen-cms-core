import { createRequire } from 'node:module'
import { expect, it, vi } from 'vitest'

const require = createRequire(import.meta.url)
const localeRedirects = require('../../config/localeRedirect.js')

it.each([401, 500])(
  'rejects HTTP %s before reading the error body',
  async (status) => {
    const json = vi.fn()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status, json })
    )
    await expect(localeRedirects(['en'])).rejects.toThrow(`HTTP ${status}`)
    expect(json).not.toHaveBeenCalled()
  }
)

it('preserves redirects for matching locales on a successful response', async () => {
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify([
            { full_slug: 'en/about' },
            { full_slug: 'de/about' },
            { full_slug: 'home' }
          ])
        )
      )
  )
  await expect(localeRedirects(['en'])).resolves.toEqual([
    {
      source: '/about',
      destination: '/en/about',
      locale: false,
      permanent: true
    }
  ])
})
