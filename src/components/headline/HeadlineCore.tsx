import React, { ElementType, FC } from 'react'
import clsx from 'clsx'
import Typography from '@material-ui/core/Typography'
import { mapTypographyVariant } from '../../utils/muiMapProps'
import { LmHeadlineProps } from './headlineTypes'

export const LmHeadlineCore: FC<LmHeadlineProps> = ({ content, onClick, children }) => (
  <Typography
    onClick={() => {
      onClick && onClick()
    }}
    className={clsx(
      content.style,
      content.style_props,
      content.class_names && content.class_names.values,
      {
        [`lm-font-${content.font}`]: content.font
      }
    )}
    component={(content.tag ? content.tag : undefined) as ElementType}
    align={content.align ? content.align : undefined}
    color={content.color ? content.color : undefined}
    style={{
      cursor: onClick ? 'pointer' : undefined,
      color:
        content.custom_color && content.custom_color.rgba
          ? content.custom_color.rgba
          : undefined,
      lineHeight: content.line_height ? content.line_height : undefined,
      fontSize: content.font_size ? content.font_size : undefined,
      letterSpacing: content.letter_spacing
        ? content.letter_spacing
        : undefined
    }}
    variant={
      mapTypographyVariant[
        content.typography ? (content.typography as string) : 'headline4'
        ]
    }
  >
    {children}
  </Typography>
)

LmHeadlineCore.displayName = 'LmHeadlineCore'
