// @vitest-environment happy-dom
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import LmFastSpringProvider from './LmFastspringProvider'

const fixture = vi.hoisted(() => ({
  authenticated: true,
  onLoad: undefined as (() => void) | undefined,
  setRedirect: vi.fn(),
  push: vi.fn(async (_path: string) => true)
}))
vi.mock('next/router', () => ({ default: { push: fixture.push } }))
vi.mock('next/script', () => ({
  default: ({ onLoad }: { onLoad: () => void }) => {
    fixture.onLoad = onLoad
    return null
  }
}))
vi.mock('../../auth/useAuth', () => ({
  useUserData: () => (fixture.authenticated ? { id: 'user' } : null)
}))
vi.mock('../../provider/SettingsPageProvider', () => ({
  useSettings: () => ({})
}))
vi.mock('./context/FastSpringContext', () => ({
  useFastspringContext: () => ({
    setRedirect: fixture.setRedirect,
    currency: 'USD',
    setProducts: vi.fn(),
    setCurrency: vi.fn(),
    redirect: '/thanks'
  })
}))

it.each([
  'https://example.test/path/page',
  'https://base.example.test/subdir/'
])(
  'retains full-page purchase refresh against document base %s',
  async (base) => {
    fixture.authenticated = true
    fixture.setRedirect.mockClear()
    fixture.push.mockClear()
    vi.spyOn(document, 'baseURI', 'get').mockReturnValue(base)
    const navigate = vi
      .spyOn(window.location, 'href', 'set')
      .mockImplementation(() => {})
    const previous = window.fscDataPopupClosed
    try {
      renderToStaticMarkup(<LmFastSpringProvider />)
      fixture.onLoad!()
      await window.fscDataPopupClosed({ id: 'order', reference: 'reference' })
      expect(navigate).toHaveBeenCalledExactlyOnceWith(
        new URL('/refetch', base).href
      )
      expect(fixture.push).not.toHaveBeenCalled()
      expect(fixture.setRedirect).toHaveBeenCalledExactlyOnceWith('')
      expect(navigate.mock.invocationCallOrder[0]).toBeLessThan(
        fixture.setRedirect.mock.invocationCallOrder[0]
      )
    } finally {
      window.fscDataPopupClosed = previous
    }
  }
)

it('keeps guest checkout on client-side navigation', async () => {
  fixture.authenticated = false
  fixture.setRedirect.mockClear()
  fixture.push.mockClear()
  const navigate = vi
    .spyOn(window.location, 'href', 'set')
    .mockImplementation(() => {})
  const previous = window.fscDataPopupClosed
  try {
    renderToStaticMarkup(<LmFastSpringProvider />)
    fixture.onLoad!()
    await window.fscDataPopupClosed({ id: 'order', reference: 'reference' })
    expect(navigate).not.toHaveBeenCalled()
    expect(fixture.push).toHaveBeenCalledExactlyOnceWith('/thanks')
    expect(fixture.setRedirect).toHaveBeenCalledExactlyOnceWith('')
  } finally {
    window.fscDataPopupClosed = previous
  }
})
