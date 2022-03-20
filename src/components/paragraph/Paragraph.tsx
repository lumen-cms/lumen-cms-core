import React from 'react'
import Typography from '@mui/material/Typography'
import parseMarkdownContent from './markdown-helper'
import { mapTypographyVariant } from '../../utils/muiMapProps'
import { useRichTextStyles } from './richTextStyles'
import { LmParagraphProps } from './paragraphTypes'

export default function LmParagraph({
  content
}: LmParagraphProps): JSX.Element {
  const { classes, cx } = useRichTextStyles()
  return (
    <Typography
      className={cx(
        'lm-markup',
        classes.richText,
        content.style,
        content.class_names?.values,
        {
          [`lm-font-${content.font}`]: !!content.font
        }
      )}
      variant={
        mapTypographyVariant[
          content.typography ? (content.typography as string) : 'body1'
        ]
      }
      component="div"
      dangerouslySetInnerHTML={{
        __html: parseMarkdownContent(content.text as string)
      }}
    />
  )
}
