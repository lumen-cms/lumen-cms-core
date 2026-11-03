// @vitest-environment happy-dom
import { expect, it } from 'vitest'
import { applyRichTextLinkTemplates } from '../../packages/lumen-cms-astro/src/client/richTextLinks'

it('retains custom rich-link structure and nested marks while binding current attributes', () => {
 const root = document.createElement('div')
 root.innerHTML = `<template data-story-rich-link="blank"><a class="custom lm-rich-link" href="__LM_RICH_HREF__" data-destination="__LM_RICH_HREF__" target="_blank"><span class="icon">→</span><span data-rich-link-slot></span></a></template>`
 const fragment = document.createRange().createContextualFragment('<p>Read <a class="lm-rich-link" href="/de?x=1&amp;y=2#details" target="_blank" rel="noopener noreferrer" download="guide"><b><i>More &amp; less</i></b></a> now.</p>')
 applyRichTextLinkTemplates(fragment, root)
 const link = fragment.querySelector('a')!
 expect(link.className).toBe('custom lm-rich-link')
 expect(link.getAttribute('href')).toBe('/de?x=1&y=2#details')
 expect(link.getAttribute('data-destination')).toBe('/de?x=1&y=2#details')
 expect(link.getAttribute('download')).toBe('guide')
 expect(link.getAttribute('rel')).toBe('noopener noreferrer')
 expect(link.querySelector('.icon')?.textContent).toBe('→')
 expect(link.querySelector('b > i')?.textContent).toBe('More & less')
 expect(link.querySelector('[data-rich-link-slot]')).toBeNull()
 expect(root.querySelector('template')!.innerHTML).toContain('__LM_RICH_HREF__')
})

it('leaves native links unchanged without a custom template', () => {
 const fragment = document.createRange().createContextualFragment('<a class="lm-rich-link" href="/page">Page</a>')
 const original = fragment.firstChild
 applyRichTextLinkTemplates(fragment, document.createElement('div'))
 expect(fragment.firstChild).toBe(original)
})
