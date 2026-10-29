import { expect, it } from 'vitest'
import { sanitizeProductDescription } from './sanitizeProductDescription'

it('preserves product formatting, links, images and tables', () => {
  const html =
    '<h2>Details</h2><p><strong>Soft</strong> cotton</p><ul><li>Wash cold</li></ul><a href="https://example.com/care">Care</a><img src="https://cdn.shopify.com/image.jpg" alt="Shirt" /><table><tr><td colspan="2">Size</td></tr></table>'
  expect(sanitizeProductDescription(html)).toBe(html)
})

it.each([
  '<script>alert(1)</script>',
  '<img src="x" onerror="alert(1)">',
  '<a href="jav&#x61;script:alert(1)">Click</a>',
  '<a href="java\nscript:alert(1)">Click</a>',
  '<iframe srcdoc="<script>alert(1)</script>"></iframe>',
  '<svg><a xlink:href="javascript:alert(1)">Click</a></svg>',
  '<img src="data:image/svg+xml,<svg onload=alert(1)>">',
  '<p style="background:url(javascript:alert(1))" onclick="alert(1)">Text</p>'
])('removes executable content from %s', (html) => {
  const result = sanitizeProductDescription(html)
  expect(result).not.toMatch(
    /alert|javascript|onerror|onclick|<script|<iframe|<svg|srcdoc|style=/i
  )
})

it('does not pass malformed API values to the HTML sink', () => {
  expect(sanitizeProductDescription(null)).toBe('')
  expect(sanitizeProductDescription({ html: '<script>bad()</script>' })).toBe(
    ''
  )
})
