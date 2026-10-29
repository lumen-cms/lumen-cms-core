import { expect, it, vi } from 'vitest'
import fetcher from './fetcher'

it('preserves JSON and request options on success', async () => {
  vi.mocked(fetch).mockResolvedValue(
    new Response(JSON.stringify({ items: [1] }))
  )
  const init = {
    headers: { Accept: 'application/json' },
    signal: new AbortController().signal
  }
  await expect(fetcher('/api/items', init)).resolves.toEqual({ items: [1] })
  expect(fetch).toHaveBeenCalledWith('/api/items', init)
})
it.each([401, 404, 429, 500])(
  'rejects HTTP %s before reading the body',
  async (status) => {
    const response = new Response('{"error":"private details"}', { status })
    const json = vi.spyOn(response, 'json')
    vi.mocked(fetch).mockResolvedValue(response)
    await expect(fetcher('/api/items?token=private')).rejects.toThrow(
      `Request failed: ${status}`
    )
    expect(json).not.toHaveBeenCalled()
  }
)
it('preserves network failures', async () => {
  const error = new TypeError('Network unavailable')
  vi.mocked(fetch).mockRejectedValue(error)
  await expect(fetcher('/api/items')).rejects.toBe(error)
})
