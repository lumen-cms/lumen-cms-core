import { describe, expect, it, vi } from 'vitest'
import { submitToGoogleForms } from './submitToGoogleForms'
import type { GoogleForm } from './types'

describe('Google Forms submission compatibility', () => {
  const form = { action: 'e/test-fixture' } as GoogleForm

  it('encodes answers, repeated checkbox entries and other-option answers', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, status: 200 })
    vi.stubGlobal('fetch', fetch)
    await expect(
      submitToGoogleForms(form, {
        '101': 'Name & a + b',
        '102': ['First option', 'Second option'],
        '103-__other_option__-other_option_response': 'My choice',
        '104_year': '2026',
        '104_month': '10',
        '104_day': '26',
        '105': ''
      })
    ).resolves.toBe(true)
    const [request, options] = fetch.mock.calls[0]
    const url = new URL(request)
    expect(url.origin + url.pathname).toBe(
      'https://docs.google.com/forms/d/e/test-fixture/formResponse'
    )
    expect(url.searchParams.get('entry.101')).toBe('Name & a + b')
    expect(url.searchParams.getAll('entry.102')).toEqual([
      'First option',
      'Second option'
    ])
    expect(url.searchParams.get('entry.103.other_option_response')).toBe(
      'My choice'
    )
    expect(url.searchParams.get('entry.104_year')).toBe('2026')
    expect(url.searchParams.has('entry.105')).toBe(false)
    expect(options).toMatchObject({ method: 'GET', mode: 'no-cors' })
  })

  it('does not claim that an opaque response confirms acceptance', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 0 }))
    await expect(submitToGoogleForms(form, { '101': 'Test' })).resolves.toBe(
      false
    )
  })

  it('propagates network failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    await expect(submitToGoogleForms(form, { '101': 'Test' })).rejects.toThrow(
      'offline'
    )
  })
})
