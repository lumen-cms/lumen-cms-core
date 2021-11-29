import { marked, Renderer } from 'marked'

const renderer = new Renderer()

function linkRendererFunc(href = '', title = '', text = '') {
  if (!href) {
    return text
  }
  if (href.includes('@')) {
    href = `mailto:${href}`
  } else if (href.includes('+')) {
    href = `tel:${href.replace('+', '')}`
  } else if (href.startsWith('http')) {
    return `<a href="${href}" title="${title}" target="_blank" rel="noopener noreferrer">${text}</a>`
  }
  return `<a href="${href}" title="${title}">${text}</a>`
}

// eslint-disable-next-line
// @ts-ignore
renderer.link = linkRendererFunc

export default function parseMarkdownContent(content: string) {
  if (!content) {
    return ''
  }
  const rawMarkup = marked(content, {
    // sanitize: true,
    renderer
  })
  return rawMarkup
}
