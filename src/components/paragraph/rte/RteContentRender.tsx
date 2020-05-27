import React from 'react'
import RteText from './RteNodeText'
import { RteContentProps, RteProps } from './rte_typings'

const ElementMap = {
  'paragraph': 'p',
  'blockquote': 'blockquote',
  'bullet_list': 'ul',
  'list_item': 'li',
  'ordered_list': 'ol',
  'horizontal_rule': 'hr',
  'hard_break': 'br',
  // 'image': '',
  'code_block': 'code'
}

type RteNodeProps = { content: RteProps }

function RteNode({ content }: RteNodeProps): JSX.Element {
  return React.createElement(
    content.type === 'heading' ? `h${content.attrs.level || '3'}` : ElementMap[content.type],
    {},
    content.content && content.content.map((blok: RteContentProps, i) => LmRteContentRenderer(blok, i))
  )
}

const RteComponents = {
  'heading': RteNode,
  'text': RteText,
  'paragraph': RteNode,
  'blockquote': RteNode,
  'bullet_list': RteNode,
  'list_item': RteNode,
  'ordered_list': RteNode,
  'horizontal_rule': () => (<hr />),
  'hard_break': RteNode,
  'image': RteNode,
  'code_block': RteNode
}

export function LmRteContentRenderer(blok: any, i: number): JSX.Element {
  if (typeof RteComponents[blok.type] !== 'undefined') {
    return React.createElement(RteComponents[blok.type], { content: blok, key: `${blok.type}_${i}` })
  }
  return React.createElement(() => (
    <div style={{ color: 'red' }}>The component {blok.type} {i} has not been created yet.</div>
  ), { key: `${blok.type}_${i}` })
}
