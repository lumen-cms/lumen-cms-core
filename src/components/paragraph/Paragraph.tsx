import clsx from 'clsx'
import * as React from 'react'
import { ParagraphStoryblok } from '../../typings/generated/components-schema'
import parseMarkdownContent from './markdown-helper'
import Typography from '@material-ui/core/Typography'
import { mapTypographyVariant } from '../../utils/muiMapProps'
import { useRichTextStyles } from './richTextStyles'

export type LmParagraphProps = { content: ParagraphStoryblok }

export function LmParagraph({ content }: LmParagraphProps): JSX.Element {
  const classes = useRichTextStyles()
  return (
    <Typography
      className={clsx('lm-markup', classes.richText, content.style, content.class_names && content.class_names.values, {
        [`lm-font-${content.font}`]: content.font
      })}
      variant={mapTypographyVariant[content.typography ? content.typography as string : 'body1']}
      component="div"
      dangerouslySetInnerHTML={{
        __html: parseMarkdownContent(content.text as string)
      }}
    />
  )
}
