import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { hasAuth0Credentials } from './auth0Helpers'

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_AUTH_PERMISSION', 'roles')
  vi.stubEnv('NEXT_PUBLIC_AUTH_PERMISSION_KEY', '')
  vi.spyOn(console, 'log').mockImplementation(() => undefined)
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

it('returns the first matching requested role for string claims', () => {
  expect(
    hasAuth0Credentials(['editor', 'admin'], { roles: ['admin', 'editor'] })
  ).toBe('editor')
  expect(hasAuth0Credentials(['viewer'], { roles: ['admin'] })).toBeUndefined()
})

it('matches the configured field in object claims', () => {
  vi.stubEnv('NEXT_PUBLIC_AUTH_PERMISSION_KEY', 'name')
  expect(hasAuth0Credentials(['editor'], { roles: [{ name: 'editor' }] })).toBe(
    'editor'
  )
  expect(
    hasAuth0Credentials(['editor'], { roles: [{ other: 'editor' }] })
  ).toBeUndefined()
})

it('keeps the any-role shortcut and empty-claim results', () => {
  expect(hasAuth0Credentials(['any'], {})).toBe(true)
  expect(hasAuth0Credentials(['editor'], {})).toBe(false)
  expect(hasAuth0Credentials(['editor'], { roles: [] })).toBe(false)
})

it('retains string indexing when a claim-field key is configured', () => {
  vi.stubEnv('NEXT_PUBLIC_AUTH_PERMISSION_KEY', '0')
  expect(hasAuth0Credentials(['e'], { roles: ['editor'] })).toBe('e')
})
