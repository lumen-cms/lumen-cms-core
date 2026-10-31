// @vitest-environment happy-dom
import { act } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import MuiNextLink from './MuiNextLink'

vi.mock('../provider/context/AppContext', () => ({
  useAppContext: () => ({
    defaultLocale: 'en',
    locales: ['en', 'de'],
    locale: 'en',
    slug: '/home'
  })
}))
vi.mock('../../utils/config', () => ({ CONFIG: {} }))

it.each([
  ['mailto:hello@example.com', 'bWFpbHRvOmhlbGxvQGV4YW1wbGUuY29t'],
  ['tel:+4912345', 'dGVsOis0OTEyMzQ1'],
  ['mailto:é@example.com', 'bWFpbHRvOulAZXhhbXBsZS5jb20=']
])(
  'preserves SSR, hydration and click decoding for %s',
  async (href, encoded) => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    const element = (
      <MuiNextLink naked external href={href}>
        Contact
      </MuiNextLink>
    )
    const host = document.createElement('div')
    host.innerHTML = renderToString(element)
    document.body.append(host)
    const link = host.querySelector('a')!
    expect(link.getAttribute('href')).toBe('/#')
    expect(link.getAttribute('data-href')).toBe(encoded)
    const onRecoverableError = vi.fn()
    const decode = vi.spyOn(globalThis, 'atob')
    let root: ReturnType<typeof hydrateRoot> | undefined
    try {
      await act(async () => {
        root = hydrateRoot(host, element, { onRecoverableError })
      })
      expect(host.querySelector('a')).toBe(link)
      const click = new MouseEvent('click', { bubbles: true, cancelable: true })
      await act(async () => {
        link.dispatchEvent(click)
      })
      expect(click.defaultPrevented).toBe(true)
      expect(decode).toHaveBeenCalledWith(encoded)
      expect(decode.mock.results.at(-1)?.value).toBe(href)
      expect(onRecoverableError).not.toHaveBeenCalled()
    } finally {
      await act(async () => root?.unmount())
      host.remove()
    }
  }
)

it.each([
  { href: 'https://example.com/path', external: true },
  { href: '/home', external: false }
])('keeps ordinary links unobfuscated: $href', ({ href, external }) => {
  const host = document.createElement('div')
  host.innerHTML = renderToString(
    <MuiNextLink naked external={external} href={href}>
      Visit
    </MuiNextLink>
  )
  const link = host.querySelector('a')!
  expect(link.getAttribute('href')).toBe(href)
  expect(link.hasAttribute('data-href')).toBe(false)
})
