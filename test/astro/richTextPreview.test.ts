// @vitest-environment happy-dom
import { afterEach, expect, it } from 'vitest'
import { updateRichTextPreview } from '../../packages/lumen-cms-astro/src/client/richTextPreview'

afterEach(() => document.body.replaceChildren())
const doc = (text: string, marks?: { type: string; attrs?: Record<string, string> }[]) => ({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text, ...(marks ? { marks } : {}) }] }] })
function setup(body = doc('Initial'), html = '<p>Initial</p>') {
 const element = document.createElement('div')
 element.dataset.lmRichtext = 'rich'; element.dataset.lmRichtextValue = JSON.stringify(body)
 element.innerHTML = html; document.body.append(element)
 return element
}
const update = (body: unknown) => updateRichTextPreview({ body: [{ _uid: 'rich', component: 'rich_text_editor', body }] })

it('updates typing synchronously and preserves the existing DOM nodes', () => {
 const element = setup(), paragraph = element.firstChild
 expect(update(doc('Typing immediately'))).toBe(true)
 expect(element.textContent).toBe('Typing immediately')
 expect(element.firstChild).toBe(paragraph)
 expect(update(doc('Typing immediately'))).toBe(false)
})
it('renders formatting, new paragraphs, lists and line breaks without a round trip', () => {
 const element = setup()
 expect(update({ type: 'doc', content: [
  { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Title' }] },
  { type: 'paragraph', content: [{ type: 'text', text: 'Bold', marks: [{ type: 'bold' }, { type: 'italic' }] }, { type: 'hard_break' }, { type: 'text', text: 'Next' }] },
  { type: 'bullet_list', content: [{ type: 'list_item', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Item' }] }] }] },
 ] })).toBe(true)
 expect(element.innerHTML).toBe('<h2>Title</h2><p><b><i>Bold</i></b><br>Next</p><ul><li><p>Item</p></li></ul>')
})
it('preserves custom link behavior when typing inside an existing link', () => {
 const marks = [{ type: 'link', attrs: { href: '/original' } }]
 const element = setup(doc('Initial', marks), '<p><a href="/localized/original" data-custom="yes">Initial</a></p>')
 const link = element.querySelector('a')
 expect(update(doc('Changed link text', marks))).toBe(true)
 expect(element.querySelector('a')).toBe(link)
 expect(link?.getAttribute('href')).toBe('/localized/original')
 expect(link?.textContent).toBe('Changed link text')
 // Link destination resolution remains authoritative on the server.
 expect(update(doc('Changed link text', [{ type: 'link', attrs: { href: '/new' } }]))).toBe(false)
 expect(link?.getAttribute('href')).toBe('/localized/original')
})
it('uses text nodes for markup-like input and leaves unsupported content to SSR', () => {
 const element = setup()
 update(doc('<img src=x onerror=alert(1)>', [{ type: 'bold' }]))
 expect(element.querySelector('img')).toBeNull()
 expect(element.textContent).toBe('<img src=x onerror=alert(1)>')
 const previous = element.innerHTML
 expect(update({ type: 'doc', content: [{ type: 'blok', attrs: { body: [] } }] })).toBe(false)
 expect(element.innerHTML).toBe(previous)
})
it('handles deleting all content and ignores other blocks', () => {
 const element = setup()
 expect(updateRichTextPreview({ component: 'rich_text_editor', _uid: 'other', body: doc('Other') })).toBe(false)
 expect(element.textContent).toBe('Initial')
 expect(update({ type: 'doc', content: [{ type: 'paragraph' }] })).toBe(true)
 expect(element.textContent).toBe('')
})
