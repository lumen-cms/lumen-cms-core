import { Theme } from '@material-ui/core/styles'
import { CSSProperties } from 'react'
import {
  BackgroundStoryblok,
  SectionStoryblok
} from '../../../typings/generated/components-schema'

export const generateBackgroundStyles = ({
  background,
  theme,
  variant
}: {
  background: BackgroundStoryblok
  theme: Theme
  variant?: SectionStoryblok['variant']
}) => {
  const mapBgColor = {
    dark: '#303030',
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    light: '#fafafa'
  }
  const mapColor = {
    light: 'rgba(0, 0, 0, 0.87)',
    dark_text: 'rgba(0, 0, 0, 0.87)',
    dark: theme.palette.common.white,
    light_text: theme.palette.common.white,
    primary: theme.palette.common.white,
    secondary: theme.palette.common.white
  }

  let border
  if (background.border_color?.rgba) {
    border = `${background.border_size || 1}px ${
      background.border_style || 'solid'
    } ${background.border_color && background.border_color.rgba}`
  } else if (background.border_radius) {
    border = '1px solid transparent'
  }

  const style: CSSProperties = {
    backgroundColor:
      background.background_color?.rgba || mapBgColor[variant as string],
    border,
    borderRadius: background.border_radius,
    color: mapColor[variant as string],
    boxShadow: background.elevation
      ? theme.shadows[background.elevation]
      : undefined,
    minHeight: background.height
  }
  Object.keys(style).forEach((key) => !style[key] && delete style[key])
  return style
}
