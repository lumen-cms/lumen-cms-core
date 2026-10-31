import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import Layout from './Layout'

const fixture = vi.hoisted(() => ({
  settings: {
    tawkto: 'legacy-account',
    chat_button: [] as { _uid: string; component: string }[]
  }
}))
vi.mock('../provider/SettingsPageProvider', () => ({
  useSettings: () => fixture.settings
}))
vi.mock('./toolbar/Header', () => ({ default: () => null }))
vi.mock('./Footer', () => ({ default: () => null }))
vi.mock('./drawer/DrawerElement', () => ({ default: () => null }))
vi.mock('../CoreComponents', () => ({
  LmComponentRender: ({ content }: { content: { _uid: string } }) => (
    <span>{content._uid}</span>
  )
}))

it('ignores obsolete tawkto settings and retains explicitly configured chat buttons', () => {
  const chat = { _uid: 'configured-chat', component: 'chat_whatsapp' }
  fixture.settings = Object.freeze({
    tawkto: 'legacy-account',
    chat_button: [chat]
  })
  expect(renderToStaticMarkup(<Layout>Page</Layout>)).toBe(
    'Page<span>configured-chat</span>'
  )
  expect(fixture.settings.chat_button[0]).toBe(chat)
})

it('does not synthesize a chat button from obsolete tawkto settings', () => {
  fixture.settings = Object.freeze({
    tawkto: 'legacy-account',
    chat_button: []
  })
  expect(renderToStaticMarkup(<Layout>Page</Layout>)).toBe('Page')
  expect(fixture.settings.chat_button).toEqual([])
})
