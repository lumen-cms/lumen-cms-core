import { useTheme } from '@material-ui/core/styles'
import { CSSProperties } from 'react'
import clsx from 'clsx'
import {
  BackgroundStoryblok,
  SectionStoryblok,
  StylesStoryblok
} from '../../typings/generated/components-schema'
import useShadowStyles from '../jss/shadowStyles'
import { useStylesAdvanced } from '../../utils/hooks/useStylesAdvanced'
import { generateBackgroundStyles } from './helper/generateBackgroundStyles'

export type UseBackgroundProps = {
  background?: BackgroundStoryblok
  variant?: SectionStoryblok['variant']
  styles?: StylesStoryblok[]
  stylesMobile?: StylesStoryblok[]
  stylesTablet?: StylesStoryblok[]
}

export type UseBackgroundPayload = {
  style?: CSSProperties
  className?: string
}

export default function useBackgroundBox(
  props: UseBackgroundProps
): UseBackgroundPayload {
  const { background, styles, stylesMobile, stylesTablet, variant } = props
  const theme = useTheme()
  const shadowClasses = useShadowStyles()
  const customClasses = useStylesAdvanced({
    props: styles,
    propsMobile: stylesMobile,
    propsTablet: stylesTablet
  })

  const style =
    background || variant
      ? generateBackgroundStyles({ background, theme, variant })
      : {}

  const className = clsx(background?.classNames?.values, {
    [shadowClasses[
      background?.shadow_effect || ''
    ]]: !!background?.shadow_effect,
    [customClasses.advanced]: styles?.length,
    [customClasses.advancedMobile]: stylesMobile?.length,
    [customClasses.advancedTablet]: stylesTablet?.length
  })
  return { className, style }
}
