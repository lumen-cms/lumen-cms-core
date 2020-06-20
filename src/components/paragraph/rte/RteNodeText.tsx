import { RteContentProps } from './rte_typings'
import React from 'react'
import clsx from 'clsx'
import MuiLink from '@material-ui/core/Link'
import { getLinkAttrs } from '../../../utils/linkHandler'
import { useAppContext } from '../../provider/context/AppContext'

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
  const { LinkRender } = useAppContext()

  if (content.marks && content.marks.length) {
    const link = content.marks.find(({ type }) => type === 'link')
    const className = clsx(content.marks.map(({ type, attrs }) => {
      if (attrs && attrs.class) {
        return attrs.class
      }
      return InlineClassMapping[type]
    }))
    if (link) {
      const btnProps: any = {
        ...getLinkAttrs({
          cached_url: link.attrs.href,
          linktype: link.attrs.linktype
        }, {}),
        naked: true,
        component: LinkRender
      }
      return <MuiLink {...btnProps}>{content.text}</MuiLink>
    }
    return <span className={className}>{content.text}</span>
  }
  return <>{content.text}</>
}

export default RteNodeText
