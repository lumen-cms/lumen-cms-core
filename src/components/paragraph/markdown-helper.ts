import marked from 'marked'

const renderer = new marked.Renderer()

renderer.link = function(href = '', title = '', text = '') {
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
export default function parseMarkdownContent(content: string) {
  const rawMarkup = marked(content, {
    //sanitize: true,
    renderer
  })
  return rawMarkup
}
