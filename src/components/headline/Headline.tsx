import React, { ElementType } from 'react'
import clsx from 'clsx'
import { componentLogger } from '../../utils/componentLogger'
import { HeadlineStoryblok } from '../../typings/generated/components-schema'
import Typography from '@material-ui/core/Typography'
import { mapTypographyVariant } from '../../utils/muiMapProps'

export type LmHeadlineProps = { content: HeadlineStoryblok }

export function LmHeadline({ content }: LmHeadlineProps): JSX.Element {
  componentLogger(content)
  const component = content.tag ? content.tag : undefined
  return (
    <Typography
      className={clsx(content.style, content.style_props, content.class_names && content.class_names.values, {
        [`lm-font-${content.font}`]: content.font
      })}
      component={component as ElementType}
      align={content.align ? content.align : undefined}
      color={content.color ? content.color : undefined}
      style={{
        color: content.custom_color && content.custom_color.rgba ? content.custom_color.rgba : undefined,
        lineHeight: content.line_height ? content.line_height : undefined,
        fontSize: content.font_size ? content.font_size : undefined,
        letterSpacing: content.letter_spacing ? content.letter_spacing : undefined
      }}
      variant={mapTypographyVariant[content.typography ? content.typography as string : 'headline4']}
    >
      {!!content.text_xs && (
        <>
          <span className="d-none d-sm-block">{content.text}</span>
          <span className="d-block d-sm-none">{content.text_xs}</span>
        </>
      )}
      <>

      </>
      {!content.text_xs && content.text}
    </Typography>
  )
}

