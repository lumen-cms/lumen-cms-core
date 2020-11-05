import React, { ElementType, FC } from 'react'
import clsx from 'clsx'
import Typography from '@material-ui/core/Typography'
import { mapTypographyVariant } from '../../utils/muiMapProps'
import { LmHeadlineProps } from './headlineTypes'
import { useStylesAdvanced } from '../../utils/hooks/useStylesAdvanced'

export const LmHeadlineCore: FC<LmHeadlineProps> = ({
  content,
  onClick,
  children
}) => {
  const classes = useStylesAdvanced({
    props: content.styles,
    propsMobile: content.styles_mobile,
    propsTablet: content.styles_tablet,
    propsHover: content.styles_hover
  })
  return (
    <Typography
      onClick={() => {
        onClick && onClick()
      }}
      className={clsx(
        content.style,
        content.style_props,
        content.class_names && content.class_names.values,
        {
          [classes.advanced]: content.styles?.length,
          [classes.advancedMobile]: content.styles_mobile?.length,
          [classes.advancedTablet]: content.styles_tablet?.length,
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
}

LmHeadlineCore.displayName = 'LmHeadlineCore'
