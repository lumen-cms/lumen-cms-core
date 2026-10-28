import { expect, it } from 'vitest'
import { renderRichText } from '@storyblok/richtext'
import { htmlToStoryblokRichtext } from '@storyblok/richtext/html-parser'

it('keeps the official HTML parser compatible with the patched DOM implementation', () => {
  const document = htmlToStoryblokRichtext(
    '<p>Hello <strong>there</strong></p>'
  )
  expect(document.type).toBe('doc')
  expect(renderRichText(document)).toContain('<strong>there</strong>')
})

it('escapes feed text through the standalone official renderer', () => {
  expect(
    renderRichText({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '<script>alert(1)</script>' }]
        }
      ]
    })
  ).toBe('<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>')
})
