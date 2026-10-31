import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import CardDescriptionText from './CardDescriptionText'
import type { CardListItemProps } from './cardTypes'

const captured = vi.hoisted(() => ({ text: undefined as string | undefined }))
vi.mock('../headline/Headline', () => ({
  LmHeadline: ({ content }: { content: { text?: string } }) => {
    captured.text = content.text
    return <span>{content.text}</span>
  }
}))

it.each([
  [undefined, 'A😀BCD'],
  [0, undefined],
  ['0', '..'],
  [-1, '..'],
  ['-1', '..'],
  [1.9, 'A..'],
  [2, 'A\ud83d..'],
  [3, 'A😀..'],
  [6, 'A😀BCD'],
  [100, 'A😀BCD'],
  [Infinity, 'A😀BCD'],
  [-Infinity, '..'],
  [NaN, 'A😀BCD'],
  ['invalid', 'A😀BCD']
] as const)(
  'preserves description truncation for limit %s',
  (limit, expected) => {
    captured.text = undefined
    const props: CardListItemProps = {
      content: {
        component: 'card_list_item',
        _uid: 'item',
        description: 'A😀BCD'
      },
      options: {
        component: 'card_list',
        _uid: 'list',
        description_max_character: limit
      }
    }
    renderToStaticMarkup(<CardDescriptionText {...props} />)
    expect(captured.text).toBe(expected)
  }
)
