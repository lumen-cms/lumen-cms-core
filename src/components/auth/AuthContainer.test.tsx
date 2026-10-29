import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import AuthContainer from './AuthContainer'
import type { AuthContainerStoryblok } from '../../typings/generated/components-schema'
const fixture = vi.hoisted(() => ({ user: undefined as any, preview: false }))
vi.mock('./useAuth', () => ({ useUserData: () => fixture.user }))
vi.mock('../provider/context/AppContext', () => ({
  useAppContext: () => ({ insideStoryblok: fixture.preview })
}))
vi.mock('../../utils/auth0/auth0Helpers', () => ({
  hasAuth0Credentials: (roles: string[], user: any) =>
    roles.some((role) => user.roles?.includes(role))
}))
vi.mock('../CoreComponents', () => ({
  LmComponentRender: ({ content }: any) => (
    <span>{content.text || content.label}</span>
  )
}))
it('personalizes shared CMS blocks for the current user without modifying them', () => {
  const headline = Object.freeze({
    _uid: 'h',
    component: 'headline',
    text: 'Hello {firstName} {lastName} {email}'
  })
  const button = Object.freeze({
    _uid: 'b',
    component: 'button',
    label: 'Email {email}'
  })
  const content = {
    _uid: 'auth',
    component: 'auth_container',
    body: [headline, button]
  } as unknown as AuthContainerStoryblok
  fixture.preview = false
  fixture.user = {
    firstName: 'Alice',
    lastName: 'A',
    email: 'alice@example.com'
  }
  expect(renderToStaticMarkup(<AuthContainer content={content} />)).toContain(
    'Hello Alice A alice@example.com'
  )
  fixture.user = { firstName: 'Bob', lastName: 'B', email: 'bob@example.com' }
  expect(renderToStaticMarkup(<AuthContainer content={content} />)).toContain(
    'Hello Bob B bob@example.com'
  )
  expect(headline.text).toBe('Hello {firstName} {lastName} {email}')
  expect(button.label).toBe('Email {email}')
})
it.each([
  [undefined, {}, false, true],
  [undefined, { display: 'require_logged_in' }, false, false],
  [{ roles: [] }, { display: 'hide_logged_in' }, false, false],
  [undefined, { hide_on_role: 'admin' }, false, false],
  [{ roles: ['admin'] }, { require_role: ' admin ' }, false, true],
  [{ roles: ['guest'] }, { require_role: 'admin' }, false, false],
  [{ roles: ['admin'] }, { hide_on_role: 'admin' }, false, false],
  [undefined, { require_role: 'admin' }, true, true]
])(
  'preserves visibility for user %j and options %j in preview %s',
  (user, options, preview, visible) => {
    fixture.user = user
    fixture.preview = preview as boolean
    const content = {
      _uid: 'auth',
      component: 'auth_container',
      ...options
    } as AuthContainerStoryblok
    const html = renderToStaticMarkup(
      <AuthContainer content={content}>Fallback</AuthContainer>
    )
    expect(html.includes('Fallback')).toBe(visible)
    expect(html.includes('lm-empty__auth')).toBe(!visible)
  }
)
