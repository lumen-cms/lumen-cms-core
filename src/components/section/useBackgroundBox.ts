import { CSSProperties } from 'react'
import { Theme, useTheme } from '@mui/material/styles'
import { SystemStyleObject } from '@mui/system'
import clsx from 'clsx'
import {
  BackgroundStoryblok,
  SectionStoryblok,
  StylesStoryblok
} from '../../typings/generated/components-schema'
import { shadowEffectSx } from '../jss/shadowStyles'
import { getAdvancedSx } from '../../utils/hooks/useStylesAdvanced'
import { generateBackgroundStyles } from './helper/generateBackgroundStyles'

export type UseBackgroundProps = {
  background?: BackgroundStoryblok
  variant?: SectionStoryblok['variant']
  styles?: StylesStoryblok[]
  stylesMobile?: StylesStoryblok[]
  stylesTablet?: StylesStoryblok[]
  stylesHover?: StylesStoryblok[]
}

export type BackgroundSx = Array<
  SystemStyleObject<Theme> | ((theme: Theme) => SystemStyleObject<Theme>)
>

export type UseBackgroundPayload = {
  style?: CSSProperties
  className?: string
  sx: BackgroundSx
}

export default function useBackgroundBox(
  props: UseBackgroundProps
): UseBackgroundPayload {
  const {
    background,
    styles,
    stylesMobile,
    stylesTablet,
    stylesHover,
    variant
  } = props
  const theme = useTheme()
  const shadowSx = background?.shadow_effect
    ? shadowEffectSx[background.shadow_effect]
    : undefined
  const advancedSx = getAdvancedSx({
    props: styles,
    propsMobile: stylesMobile,
    propsTablet: stylesTablet,
    propsHover: stylesHover
  })

  const style =
    background || variant
      ? generateBackgroundStyles({ background, theme, variant })
      : undefined

  const className = clsx(background?.classNames?.values) || undefined
  const sx: BackgroundSx = []
  if (shadowSx) {
    sx.push(shadowSx)
  }
  if (advancedSx) {
    sx.push(advancedSx)
  }
  return { className, style, sx }
}
