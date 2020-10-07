import React from 'react'
import clsx from 'clsx'
import MuiLink from '@material-ui/core/Link'
import { LmCoreComponents } from '@CONFIG'
import { RteContentProps } from './rte_typings'
import { getLinkAttrs } from '../../../utils/linkHandler'

const InlineClassMapping = {
  bold: 'font-weight-bold',
  strike: 'text-decoration-line-through',
  underline: 'text-decoration-underline',
  strong: 'font-weight-bolder',
  code: 'text-code',
  italic: 'font-italic',
  link: 'text-link',
  styled: ''
}

type RteNodeTextProps = { content: RteContentProps }

function RteNodeText({ content }: RteNodeTextProps): JSX.Element {
  if (content.marks && content.marks.length) {
    const link = content.marks.find(({ type }) => type === 'link')
    const className = clsx(
      content.marks.map(({ type, attrs }) => {
        if (attrs && attrs.class) {
          return attrs.class
        }
        return InlineClassMapping[type]
      })
    )
    if (link?.attrs?.href) {
      const btnProps: any = {
        ...getLinkAttrs(
          {
            cached_url: link.attrs.href,
            linktype: link.attrs.linktype
          },
          {}
        ),
        naked: true,
        component: LmCoreComponents.lm_link_render
      }
      return <MuiLink {...btnProps}>{content.text}</MuiLink>
    }
    return <span className={className}>{content.text}</span>
  }
  return <>{content.text}</>
}

export default RteNodeText
