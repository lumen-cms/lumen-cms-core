/** Preview-only optimistic rendering. Unsupported nodes/links keep the existing
 * server renderer; no HTML from the editor is ever inserted as markup. */
interface RichNode { type: string; text?: string; attrs?: Record<string, unknown>; marks?: RichNode[]; content?: RichNode[] }
const tags: Record<string, string> = { paragraph: 'p', blockquote: 'blockquote', ordered_list: 'ol', bullet_list: 'ul', list_item: 'li', hard_break: 'br', horizontal_rule: 'hr' }
const marks: Record<string, string> = { bold: 'b', strong: 'strong', italic: 'i', strike: 's', underline: 'u', code: 'code', styled: 'span' }

function render(node: RichNode): Node {
 let result: Node
 if (node.type === 'text') result = document.createTextNode(node.text || '')
 else {
  if (node.type === 'doc') result = document.createDocumentFragment()
  else if (node.type === 'code_block') {
   const pre = document.createElement('pre'), code = document.createElement('code')
   if (typeof node.attrs?.class === 'string') code.className = node.attrs.class
   code.append(...(node.content || []).map(render)); pre.append(code); return pre
  } else {
   const tag = node.type === 'heading' ? `h${Math.min(6, Math.max(1, Number(node.attrs?.level) || 1))}` : tags[node.type]
   if (!tag) throw new Error('Server-rendered rich text node')
   if (node.type === 'paragraph' && !node.content?.length) return document.createDocumentFragment()
   result = document.createElement(tag)
   if (node.type === 'heading' && !node.content?.some(child => child.text?.trim() || child.content?.length)) (result as HTMLElement).setAttribute('aria-hidden', 'true')
  }
  for (const child of node.content || []) result.appendChild(render(child))
 }
 for (const mark of [...(node.marks || [])].reverse()) {
  const tag = marks[mark.type]
  // Links can use consumer routing/components: preserve those server semantics.
  if (!tag) throw new Error('Server-rendered rich text mark')
  const wrapper = document.createElement(tag)
  if (mark.type === 'styled' && typeof mark.attrs?.class === 'string') wrapper.className = mark.attrs.class
  wrapper.append(result); result = wrapper
 }
 return result
}

function textLeaves(node: RichNode): string[] {
 return node.type === 'text' ? [node.text || ''] : (node.content || []).flatMap(textLeaves)
}
function structure(node: RichNode): string {
 return JSON.stringify(node, (key, value) => key === 'text' ? '' : value)
}

/** Preserve custom link elements when only their text changes. */
function patchText(element: HTMLElement, previous: RichNode, next: RichNode) {
 if (structure(previous) !== structure(next)) return false
 const previousLeaves = textLeaves(previous), nextLeaves = textLeaves(next)
 if (previousLeaves.some((text, i) => !!text !== !!nextLeaves[i])) return false
 const before = previousLeaves.filter(Boolean), after = nextLeaves.filter(Boolean)
 const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
 const nodes: Text[] = []
 while (walker.nextNode()) if (walker.currentNode.textContent) nodes.push(walker.currentNode as Text)
 if (nodes.length !== before.length || before.length !== after.length || nodes.some((node, i) => node.data !== before[i])) return false
 nodes.forEach((node, i) => { node.data = after[i] })
 return true
}

export function updateRichTextPreview(content: unknown) {
 const bodies = new Map<string, RichNode>()
 function visit(value: unknown) {
  if (!value || typeof value !== 'object') return
  if (Array.isArray(value)) { value.forEach(visit); return }
  const block = value as Record<string, unknown>
  if (block.component === 'rich_text_editor' && typeof block._uid === 'string' && block.body) bodies.set(block._uid, block.body as RichNode)
  // News/Event render their top-level content through a synthetic rich-text block.
  if (block.component === 'news' && block.content) bodies.set('richtext', block.content as RichNode)
  if (block.component === 'event' && block.content) bodies.set(`rich_text_${block._uid}`, block.content as RichNode)
  Object.values(block).forEach(visit)
 }
 visit(content)
 let updated = false
 document.querySelectorAll<HTMLElement>('[data-lm-richtext]').forEach(element => {
  const next = bodies.get(element.dataset.lmRichtext!)
  if (!next || next.type !== 'doc') return
  const serialized = JSON.stringify(next)
  if (element.dataset.lmRichtextValue === serialized) return
  try {
   const previous = JSON.parse(element.dataset.lmRichtextValue || 'null') as RichNode | null
   if (!previous || !patchText(element, previous, next)) element.replaceChildren(render(next))
   element.dataset.lmRichtextValue = serialized
   updated = true
  } catch { /* The SDK's server update handles unsupported rich text. */ }
 })
 return updated
}
