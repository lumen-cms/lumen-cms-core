import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import { renderRichText } from './renderRichText'

it('preserves legacy marks, empty containers and marked line breaks', () => {
  const document = {
    type: 'doc',
    content: [
      { type: 'paragraph', content: [] },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Same style',
            marks: [
              { type: 'bold' },
              { type: 'italic' },
              { type: 'textStyle', attrs: { color: 'red' } }
            ]
          },
          {
            type: 'hard_break',
            marks: [{ type: 'styled', attrs: { class: 'legacy' } }]
          }
        ]
      },
      {
        type: 'ordered_list',
        attrs: { order: 4 },
        content: [
          { type: 'list_item', content: [{ type: 'paragraph' }] },
          {
            type: 'list_item',
            content: [
              { type: 'paragraph', content: [{ type: 'text', text: 'Item' }] }
            ]
          }
        ]
      }
    ]
  }
  const original = JSON.stringify(document)
  expect(renderToStaticMarkup(renderRichText(document))).toBe(
    '<p><b><i>Same style</i></b><span class="legacy"><br/></span></p><ol><li><p>Item</p></li></ol>'
  )
  expect(JSON.stringify(document)).toBe(original)
})

it('keeps plain strings escaped and handles empty/invalid fields', () => {
  expect(renderToStaticMarkup(renderRichText('<b>Text</b>'))).toBe(
    '&lt;b&gt;Text&lt;/b&gt;'
  )
  expect(renderRichText(null)).toBe(null)
  expect(
    renderToStaticMarkup(renderRichText({ type: 'doc', content: [] }))
  ).toBe('')
})
