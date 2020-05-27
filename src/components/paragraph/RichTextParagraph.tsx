import clsx from 'clsx'
import * as React from 'react'
import { RichTextEditorStoryblok } from '../../typings/generated/components-schema'
import { LmRteContentRenderer } from './rte/RteContentRender'
import Typography from '@material-ui/core/Typography'
import { mapTypographyVariant } from '../../utils/muiMapProps'
import { useRichTextStyles } from './richTextStyles'

export type LmRichTextParagraphProps = { content: RichTextEditorStoryblok }

export function LmRichTextParagraph({ content }: LmRichTextParagraphProps): JSX.Element {
  const classes = useRichTextStyles()
  return (
    <Typography
      className={clsx('lm-markup', classes.richText, content.style, content.class_names && content.class_names.values, {
        [`lm-font-${content.font}`]: content.font
      })}
      align={content.align ? content.align : undefined}
      color={content.color ? content.color : undefined}
      component="div"
      style={{
        color: content.custom_color && content.custom_color.rgba ? content.custom_color.rgba : undefined,
        lineHeight: content.line_height ? content.line_height : undefined,
        fontSize: content.font_size ? content.font_size : undefined,
        letterSpacing: content.letter_spacing ? content.letter_spacing : undefined
      }}
      variant={mapTypographyVariant[content.typography ? content.typography as string : 'body1']}>
      {content.body && content.body.content.map((blok: any, i: number) => LmRteContentRenderer(blok, i))}
    </Typography>
  )
}

