import sanitizeHtml from 'sanitize-html'

export function sanitizeProductDescription(html: unknown): string {
  if (typeof html !== 'string') return ''
  return sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
    allowedAttributes: {
      a: ['href', 'title'],
      img: ['src', 'alt', 'width', 'height'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan', 'scope']
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: false
  })
}
