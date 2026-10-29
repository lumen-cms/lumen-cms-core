// @vitest-environment happy-dom
import { act, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import LmAuthForm from './AuthForm'

const auth = vi.hoisted(() => ({ token: vi.fn(), available: true }))
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () =>
    auth.available ? { getAccessTokenSilently: auth.token } : undefined
}))
vi.mock('./useAuth', () => ({
  useUserData: () => ({
    sub: 'auth0|user',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.test'
  })
}))
vi.mock('next/router', () => ({ useRouter: () => ({ locale: 'en' }) }))
vi.mock('react-hook-form-mui', () => ({
  FormContainer: ({
    children,
    onSuccess
  }: {
    children: ReactNode
    onSuccess: (data: object) => Promise<void>
  }) => (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void onSuccess({ given_name: 'Ada', family_name: 'Lovelace' })
      }}
    >
      {children}
    </form>
  ),
  TextFieldElement: () => null
}))
vi.mock('../CoreComponents', () => ({
  LmComponentRender: ({
    content,
    disabled,
    onClick
  }: {
    content: { label: string }
    disabled?: boolean
    onClick?: () => void
  }) => (
    <button disabled={disabled} onClick={onClick}>
      {content.label}
    </button>
  )
}))

it.each(['update', 'delete'] as const)(
  'recovers %s from token and HTTP failures, then permits a successful retry',
  async (action) => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    auth.available = true
    let rejectToken!: (error: Error) => void
    auth.token
      .mockReset()
      .mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            rejectToken = reject
          })
      )
      .mockResolvedValue('test-token')
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status: 503 }))
      .mockResolvedValue(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetchMock)
    const reload = vi
      .spyOn(window.location, 'reload')
      .mockImplementation(() => {})
    const container = document.createElement('div')
    document.body.append(container)
    const root = createRoot(container)
    try {
      await act(async () =>
        root.render(
          <LmAuthForm
            content={{
              _uid: 'account',
              component: 'auth_form',
              account_delete_button: [
                { _uid: 'delete', component: 'button', label: 'Delete' }
              ]
            }}
          />
        )
      )
      const button = [...container.querySelectorAll('button')].find(
        (b) => b.textContent === (action === 'update' ? 'Update' : 'Delete')
      )!
      await act(async () => button.click())
      expect(button.disabled).toBe(true)
      await act(async () => rejectToken(new Error('Session expired')))
      expect(button.disabled).toBe(false)
      expect(container.querySelector('[role="alert"]')?.textContent).toContain(
        'Please try again'
      )
      expect(fetchMock).not.toHaveBeenCalled()
      expect(reload).not.toHaveBeenCalled()
      await act(async () => button.click())
      expect(button.disabled).toBe(false)
      expect(container.querySelector('[role="alert"]')).not.toBeNull()
      expect(reload).not.toHaveBeenCalled()
      await act(async () => button.click())
      expect(button.disabled).toBe(false)
      expect(container.querySelector('[role="alert"]')).toBeNull()
      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(reload).toHaveBeenCalledTimes(action === 'delete' ? 1 : 0)
    } finally {
      await act(async () => root.unmount())
      container.remove()
    }
  }
)
