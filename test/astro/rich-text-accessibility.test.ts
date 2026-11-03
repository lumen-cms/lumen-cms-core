// @vitest-environment happy-dom
import { expect, it } from 'vitest'
import { createRichTextRenderer } from '../../packages/lumen-cms-shared/src/richText'
const render = createRichTextRenderer(attrs => ({ href: attrs.href }))
it('keeps whitespace formatting without creating an unnamed focusable link', () => {
 const html = render({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: ' ', marks: [{ type: 'link', attrs: { href: '/payment' } }, { type: 'styled', attrs: { class: 'spacing' } }] }] }] })
 const container = document.createElement('div'); container.innerHTML = html
 expect(container.querySelector('a')).toBeNull()
 expect(container.querySelector('.spacing')?.textContent).toBe(' ')
})
it('retains named text links and image links', () => {
 const html = render({ type: 'doc', content: [{ type: 'text', text: 'Payment', marks: [{ type: 'link', attrs: { href: '/payment' } }] }, { type: 'image', attrs: { src: '/logo.svg', alt: 'Company' }, marks: [{ type: 'link', attrs: { href: '/' } }] }] })
 const container = document.createElement('div'); container.innerHTML = html
 expect(container.querySelectorAll('a')).toHaveLength(2)
 expect(container.querySelector('a img')?.getAttribute('alt')).toBe('Company')
})
it('excludes empty headings from accessibility without changing their layout element', () => {
 const html = render({ type: 'doc', content: [{ type: 'heading', attrs: { level: 3 }, content: [] }, { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Details' }] }] })
 const container = document.createElement('div'); container.innerHTML = html
 expect(container.querySelector('h3')?.getAttribute('aria-hidden')).toBe('true')
 expect(container.querySelector('h2')?.hasAttribute('aria-hidden')).toBe(false)
})
