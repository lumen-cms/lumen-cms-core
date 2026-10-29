import { expect, it, vi } from 'vitest'
import { fetchInstagramList, fetchInstagramUserId } from './instagramHelpers'
vi.mock('instagram-scraping', () => ({ default: {} }))

it('preserves exact username matching and missing-user results', async () => {
  vi.mocked(fetch).mockResolvedValueOnce(
    new Response(
      JSON.stringify({
        users: [
          { user: { username: 'other', pk: '1' } },
          { user: { username: 'example', pk: '2' } }
        ]
      })
    )
  )
  await expect(fetchInstagramUserId('example')).resolves.toBe('2')
  expect(fetch).toHaveBeenCalledWith(
    'https://www.instagram.com/web/search/topsearch/?query=example'
  )
  vi.mocked(fetch).mockResolvedValueOnce(
    new Response(JSON.stringify({ users: [] }))
  )
  await expect(fetchInstagramUserId('missing')).resolves.toBeUndefined()
})
it('preserves successful list data and the request URL', async () => {
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.mocked(fetch).mockResolvedValue(
    new Response(JSON.stringify({ items: [1] }))
  )
  await expect(fetchInstagramList('example')).resolves.toEqual({ items: [1] })
  expect(fetch).toHaveBeenCalledWith(
    'https://www.instagram.com/example/channel/?__a=1',
    {}
  )
})
it.each([fetchInstagramUserId, fetchInstagramList])(
  'rejects HTTP errors before parsing for %s',
  async (load) => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    for (const status of [401, 404, 429, 500]) {
      const response = new Response('{"users":[],"error":"private"}', {
        status
      })
      const json = vi.spyOn(response, 'json')
      vi.mocked(fetch).mockResolvedValue(response)
      await expect(load('example')).rejects.toThrow(
        `Instagram request failed: ${status}`
      )
      expect(json).not.toHaveBeenCalled()
    }
  }
)
it.each([fetchInstagramUserId, fetchInstagramList])(
  'preserves network failures for %s',
  async (load) => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    const error = new TypeError('Offline')
    vi.mocked(fetch).mockRejectedValue(error)
    await expect(load('example')).rejects.toBe(error)
  }
)
