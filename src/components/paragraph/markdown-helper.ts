import { Marked, Renderer, TextRenderer } from 'marked'
import { legacyTokenizer } from '../../vendor/marked-legacy/tokenizer'
import { createHeadingId } from '../../vendor/marked-legacy/headingId'

function linkRendererFunc(href = '', title: string | null = '', text = '') {
  if (!href) return text
  if (href.includes('@')) {
    href = `mailto:${href}`
  } else if (href.includes('+')) {
    href = `tel:${href.replace('+', '')}`
  } else if (href.startsWith('http')) {
    return `<a href="${href}" title="${title}" target="_blank" rel="noopener noreferrer">${text}</a>`
  }
  return `<a href="${href}" title="${title}">${text}</a>`
}

export default function parseMarkdownContent(content: string): string {
  if (!content) return ''
  // Keep configuration and heading counters local to one document.
  const renderer = new Renderer()
  const headingId = createHeadingId()
  const textRenderer = new TextRenderer()
  renderer.link = function (token) {
    // Marked 4 obfuscated automatic email links. Preserve their decoded URL
    // without adding a second mailto prefix when Marked 18 returns plain text.
    const href =
      token.href.startsWith('mailto:') && !token.raw.startsWith('[')
        ? token.href.replaceAll('@', '&#64;')
        : token.href
    return linkRendererFunc(
      href,
      token.title,
      this.parser.parseInline(token.tokens)
    )
  }
  renderer.heading = function (token) {
    const text = this.parser.parseInline(token.tokens)
    textRenderer.parser = this.parser
    const id = headingId(this.parser.parseInline(token.tokens, textRenderer))
    return `<h${token.depth} id="${id}">${text}</h${token.depth}>\n`
  }
  const parser = new Marked(
    { renderer, async: false },
    { tokenizer: legacyTokenizer }
  )
  return parser.parse(content, { async: false })
}
