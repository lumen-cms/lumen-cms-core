// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { SWRConfig } from 'swr'
import { expect, it, vi } from 'vitest'
import useTravelSearch from './useTravelSearch'

vi.mock('next/router', () => ({ useRouter: () => ({ locale: 'de' }) }))
vi.mock('../page/PageContext', () => ({
  usePageContext: () => ({ value: { city: '1', searchtext: 'Bali & Java' } })
}))

it.each([200, 400, 500])('handles HTTP %s through SWR', async (status) => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const payload =
    status === 200 ? { city: [{ id: 1 }] } : { message: 'Failure' }
  const json = vi.fn().mockResolvedValue(payload)
  vi.mocked(fetch).mockResolvedValue({
    ok: status === 200,
    status,
    json
  } as unknown as Response)
  let result: ReturnType<typeof useTravelSearch>
  function Reader() {
    result = useTravelSearch()
    return null
  }
  const root = createRoot(document.createElement('div'))
  try {
    await act(async () => {
      root.render(
        <SWRConfig
          value={{ provider: () => new Map(), shouldRetryOnError: false }}
        >
          <Reader />
        </SWRConfig>
      )
    })
    expect(fetch).toHaveBeenCalledWith(
      '/api/categories?city=1&searchtext=Bali+%26+Java&locale=de'
    )
    if (status === 200) {
      expect(result!.data).toEqual(payload)
      expect(result!.error).toBeUndefined()
      expect(json).toHaveBeenCalledOnce()
    } else {
      expect(result!.error).toBeInstanceOf(Error)
      expect(result!.error.message).toContain(String(status))
      expect(result!.data).toBeUndefined()
      expect(json).not.toHaveBeenCalled()
    }
  } finally {
    await act(() => root.unmount())
  }
})
