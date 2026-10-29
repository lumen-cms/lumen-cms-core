import { expect, it, vi } from 'vitest'
import { fetchGoogleFormDataClient } from './fetchGoogleFormData'

const url = ' https://docs.google.com/forms/d/test/viewform '
it('preserves proxy encoding and successful HTML', async () => {
  vi.mocked(fetch).mockResolvedValue(new Response('<form>Choices</form>'))
  await expect(fetchGoogleFormDataClient(url)).resolves.toBe(
    '<form>Choices</form>'
  )
  expect(fetch).toHaveBeenCalledWith(
    `https://googleformrestyler.apixml.net/corsProxy.aspx?base64Url=${btoa(
      url.trim()
    )}`
  )
})
it('keeps the empty result for unsupported URLs without fetching', async () => {
  await expect(fetchGoogleFormDataClient('https://example.com')).resolves.toBe(
    ''
  )
  expect(fetch).not.toHaveBeenCalled()
})
it.each([403, 404, 429, 500])(
  'rejects proxy HTTP %s before consuming HTML',
  async (status) => {
    const response = new Response('<form>Error page</form>', { status })
    const text = vi.spyOn(response, 'text')
    vi.mocked(fetch).mockResolvedValue(response)
    await expect(fetchGoogleFormDataClient(url)).rejects.toThrow(
      `Google Form proxy request failed: ${status}`
    )
    expect(text).not.toHaveBeenCalled()
  }
)
it('preserves network errors', async () => {
  const error = new TypeError('Offline')
  vi.mocked(fetch).mockRejectedValue(error)
  await expect(fetchGoogleFormDataClient(url)).rejects.toBe(error)
})
