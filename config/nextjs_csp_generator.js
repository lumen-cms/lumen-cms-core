const coreHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  }
]

// Retain the public helper name and accepted options. CSP was not emitted by
// this helper before the Next 16 migration; enabling a new policy is separate.
module.exports = (_options = {}) => coreHeaders.map((header) => ({ ...header }))
