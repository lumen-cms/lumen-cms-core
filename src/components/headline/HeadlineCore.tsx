import React, { ElementType, FC } from 'react'
import clsx from 'clsx'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { mapTypographyVariant } from '../../utils/muiMapProps'
import { LmHeadlineProps } from './headlineTypes'
import { useStylesAdvanced } from '../../utils/hooks/useStylesAdvanced'
import { HeadlineStoryblok } from '../../typings/generated/components-schema'

// src: https://stackoverflow.com/a/13924997/8062659
const useStyles = makeStyles({
  multiLineEllipsis: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': ({ max_lines }: HeadlineStoryblok) =>
      Number(max_lines),
    '-webkit-box-orient': 'vertical'
  }
})

export const LmHeadlineCore: FC<LmHeadlineProps> = ({
  content,
  onClick,
  children
}) => {
  const multilineClasses = useStyles(content)
  const classes = useStylesAdvanced({
    props: content.styles,
    propsMobile: content.styles_mobile,
    propsTablet: content.styles_tablet,
    propsHover: content.styles_hover
  })
  return (
    <Typography
      {...(onClick ? { onClick: () => onClick() } : {})}
      className={clsx(
        content.style,
        content.style_props,
        content.class_names?.values,
        {
          enable__speech: content.enable_speech,
          [multilineClasses.multiLineEllipsis]: content.max_lines,
          [classes.advanced]: content.styles?.length,
          [classes.advancedMobile]: content.styles_mobile?.length,
          [classes.advancedTablet]: content.styles_tablet?.length,
          [classes.advancedHover]: content.styles_hover?.length,
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
