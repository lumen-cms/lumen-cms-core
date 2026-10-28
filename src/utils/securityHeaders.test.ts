import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'
import baseline from './__fixtures__/securityHeaders.json'

const require = createRequire(import.meta.url)
const headers = require('../../config/nextjs_csp_generator') as (
  options?: Record<string, unknown>
) => { key: string; value: string }[]

describe('security header compatibility', () => {
  it.each([
    {},
    { ignoreCsp: true },
    { ignoreCsp: false, contentSecurityPolicy: { 'script-src': ["'self'"] } }
  ])('preserves the pre-migration response headers for %j', (options) => {
    expect(headers(options)).toEqual(baseline)
  })
  it('does not let one consumer mutate another consumer’s headers', () => {
    const result = headers()
    result[0].value = 'changed'
    result.push({ key: 'extra', value: 'extra' })
    expect(headers()).toEqual(baseline)
  })
})
