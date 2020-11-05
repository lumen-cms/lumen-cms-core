import { makeStyles, Theme } from '@material-ui/core/styles'
import { CreateCSSProperties } from '@material-ui/core/styles/withStyles'
import { CSSProperties } from 'react'
import { StylesStoryblok } from '../../typings/generated/components-schema'

const addImportant = (value?: string) =>
  value ? `${value} !important` : undefined

const getStyles = (
  content: StylesStoryblok,
  theme: Theme
): CreateCSSProperties => {
  const r: CreateCSSProperties = {
    margin: addImportant(content.margin),
    padding: addImportant(content.padding),
    backgroundColor: addImportant(content.background_color?.rgba),
    width: addImportant(content.width),
    height: addImportant(content.height),
    display: addImportant(content.display),
    zIndex: content.z_index,
    borderRadius: addImportant(content.border_radius),
    position: addImportant(content.position) as any,
    boxShadow: content.elevation
      ? theme.shadows[`${content.elevation}`]
      : content.box_shadow || undefined,
    top: content.top,
    left: content.left,
    bottom: content.bottom,
    right: content.right,
    border: content.border_color?.rgba
      ? addImportant(`1px solid ${content.border_color.rgba}`)
      : undefined
  }
  return r
}

type UseStylesAdvancedProps = {
  props?: StylesStoryblok[]
  propsTablet?: StylesStoryblok[]
  propsMobile?: StylesStoryblok[]
  propsHover?: StylesStoryblok[]
}

export const useStylesAdvanced = makeStyles((theme: Theme) => ({
  advanced: ({ props }: UseStylesAdvancedProps) => {
    if (!props || !props.length) {
      return {} as CreateCSSProperties
    }
    return getStyles(props[0], theme)
  },
  advancedMobile: ({ propsMobile }: UseStylesAdvancedProps) => {
    if (!propsMobile || !propsMobile.length) {
      return {} as CreateCSSProperties
    }
    return {
      [theme.breakpoints.only('xs')]: {
        ...getStyles(propsMobile[0], theme)
      }
    }
  },
  advancedTablet: ({ propsTablet }: UseStylesAdvancedProps) => {
    if (!propsTablet || !propsTablet.length) {
      return {} as CreateCSSProperties
    }
    return {
      [theme.breakpoints.between('sm', 'md')]: {
        ...getStyles(propsTablet[0], theme)
      }
    }
  },
  advancedHover: ({ propsHover }: UseStylesAdvancedProps) => {
    if (!propsHover || !propsHover.length) {
      return {} as CreateCSSProperties
    }
    return {
      '&:hover': {
        ...getStyles(propsHover[0], theme)
      }
    }
  }
}))
