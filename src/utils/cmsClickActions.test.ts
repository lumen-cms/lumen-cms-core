import { afterEach, expect, it, vi } from 'vitest'
import { cmsClickActions, getCmsClickProps } from './cmsClickActions'

afterEach(() => cmsClickActions.clear())

it('runs only explicitly registered application handlers', () => {
  const handler = vi.fn()
  cmsClickActions.set('open-contact', handler)
  getCmsClickProps('open-contact').onClick?.()
  expect(handler).toHaveBeenCalledOnce()
})

it.each([
  'alert(document.cookie)',
  'constructor',
  '__proto__',
  'toString',
  '',
  undefined
])(
  'does not interpret unregistered CMS content %s as executable code',
  (action) => expect(getCmsClickProps(action)).toEqual({})
)
