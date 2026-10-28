import { describe, expect, it } from 'vitest'
import { load } from 'cheerio'
import parseMarkdownContent from './markdown-helper'
import fixtures from './__fixtures__/markdown.json'

export function markdownDom(html: string) {
  const $ = load(html, null, false)
  // Only ignore pretty-print whitespace between block/list/table elements.
  // Inline whitespace, text, attributes, IDs and nesting remain significant.
  $.root()
    .find('*')
    .addBack()
    .contents()
    .each((_, node) => {
      if (
        node.type === 'text' &&
        !node.data.trim() &&
        ['root', 'ul', 'ol', 'table', 'thead', 'tbody', 'tr'].includes(
          node.parent?.type === 'root'
            ? 'root'
            : node.parent && 'name' in node.parent
            ? node.parent.name
            : ''
        )
      ) {
        $(node).remove()
      }
    })
  return $.root().html()
}

describe('Markdown output compatibility', () => {
  it.each(fixtures.map((fixture, index) => ({ ...fixture, index })))(
    'preserves legacy markup case $index',
    ({ source, html }) => {
      expect(markdownDom(parseMarkdownContent(source))).toBe(markdownDom(html))
    }
  )
  it('does not leak duplicate heading IDs between documents', () => {
    expect(parseMarkdownContent('# Title\n\n# Title')).toContain('id="title-1"')
    expect(parseMarkdownContent('# Title')).toBe('<h1 id="title">Title</h1>\n')
  })
})
