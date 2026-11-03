export const escapeHtml = (value: unknown): string => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!))
/** Conservatively retain image/block content; whitespace alone has no accessible name. */
export function hasRichTextContent(value: unknown): boolean {
 if (!value || typeof value !== 'object') return typeof value === 'string' && !!value.trim()
 const node = value as { type?: string; text?: string; content?: unknown[] }
 return node.type === 'image' || node.type === 'blok' || !!node.text?.trim() || !!node.content?.some(hasRichTextContent)
}
type Node = { type: string; text?: string; attrs?: Record<string, any>; marks?: Node[]; content?: Node[] }
const marks: Record<string, string> = { bold: 'b', strong: 'strong', italic: 'i', strike: 's', underline: 'u', code: 'code', styled: 'span' }
export function createRichTextRenderer(resolveLink: (attrs: Record<string, any>) => Record<string, unknown>) {
function wrapMarks(body: string, entries: Node[] = [], meaningful = true): string {
  return entries.reduceRight((result, mark) => {
    const attrs = mark.attrs || {}
    if (mark.type === 'link') {
      if (!meaningful) return result
      const link = resolveLink(attrs)
      return `<a class="lm-rich-link"${['href', 'target', 'rel', 'download'].filter(key => link[key as keyof typeof link]).map(key => ` ${key}="${escapeHtml(link[key as keyof typeof link])}"`).join('')}>${result}</a>`
    }
    const tag = marks[mark.type]
    return tag ? `<${tag}${mark.type === 'styled' && attrs.class ? ` class="${escapeHtml(attrs.class)}"` : ''}>${result}</${tag}>` : result
  }, body)
}
function render(node: Node): string {
  const body = (node.content || []).map(render).join('')
  const containers: Record<string, string> = { paragraph: 'p', blockquote: 'blockquote', ordered_list: 'ol', bullet_list: 'ul', list_item: 'li' }
  let result = body
  if (node.type === 'text') result = escapeHtml(node.text)
  else if (node.type === 'blok') result = ''
  else if (node.type === 'hard_break') result = '<br>'
  else if (node.type === 'horizontal_rule') result = '<hr>'
  else if (containers[node.type]) result = node.content?.length ? `<${containers[node.type]}>${body}</${containers[node.type]}>` : ''
  else if (node.type === 'heading') {
    const level = Math.min(6, Math.max(1, Number(node.attrs?.level) || 1))
    result = `<h${level}${hasRichTextContent(node) ? '' : ' aria-hidden="true"'}>${body}</h${level}>`
  } else if (node.type === 'code_block') result = `<pre><code${node.attrs?.class ? ` class="${escapeHtml(node.attrs.class)}"` : ''}>${body}</code></pre>`
  else if (node.type === 'image') result = `<img${Object.entries(node.attrs || {}).filter(([key]) => ['src', 'alt', 'title', 'width', 'height', 'loading', 'class'].includes(key)).map(([key, value]) => ` ${key}="${escapeHtml(value)}"`).join('')}>`
  return wrapMarks(result, node.marks, hasRichTextContent(node))
}
return function renderRichText(body: unknown): string {
  if (typeof body === 'string') return escapeHtml(body)
  const node = body as Node | null
  return node?.type === 'doc' && Array.isArray(node.content) ? render(node) : ''
}

}
