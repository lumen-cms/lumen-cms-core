import { Theme } from '@mui/material/styles'

import {
  ItemKeyValueStoryblok,
  StylesStoryblok
} from '../../typings/generated/components-schema'
import { makeStyles } from 'tss-react/mui'
import { CSSObject } from 'tss-react'

const addImportant = (value?: string) =>
  value ? `${value} !important` : undefined
const snakeToCamelCase = (key: string) =>
  key.replace(/_([a-z])/g, (_, m) => m.toUpperCase())

const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1)

const getStyles = (content: StylesStoryblok, theme: Theme) => {
  const getThemeMainColor = (color: string) => {
    const parts = color.split('.')
    return theme.palette[parts[0]][parts[1] || 'main']
  }
  const cssRules: CSSObject = {}
  Object.keys(content).forEach((key) => {
    if (['component', '_uid', 'elevation', 'box_shadow'].includes(key)) {
      return // dont get unnecessary fields or edge cases
    }
    if (key.startsWith('border_') && !key.startsWith('border_radius')) {
      return // we handle border differently
    }
    if (key.startsWith('color')) {
      return
    }
    if (key.startsWith('background_color')) {
      return
    }
    if (key === 'css_properties') {
      if (content.css_properties?.length) {
        content.css_properties?.forEach((k: ItemKeyValueStoryblok) => {
          cssRules[k.key as string] = k.value_color?.rgba
            ? k.value_color?.rgba
            : k.value
        })
      }
    } else if (content[key]) {
      // eslint-disable-next-line no-prototype-builtins
      const curVal = content[key]?.hasOwnProperty('rgba')
        ? content[key]?.rgba
        : content[key]
      if (!curVal) {
        return
      }
      cssRules[snakeToCamelCase(key)] = addImportant(curVal)
    }
  })
  // edge cases
  if (content.box_shadow || content.elevation) {
    cssRules.boxShadow = content.elevation
      ? theme.shadows[`${content.elevation}`]
      : content.box_shadow
  }
  if (content.border_color?.rgba || content.border_color_theme) {
    const borderStr = `${content.border_width || 1}px ${
      content.border_style || 'solid'
    } ${
      content.border_color?.rgba ||
      getThemeMainColor(content.border_color_theme || 'grey')
    }`
    if (content.border_position?.length) {
      content.border_position.forEach((key) => {
        cssRules[`border${capitalizeFirstLetter(key)}`] =
          addImportant(borderStr)
      })
    } else {
      cssRules.border = addImportant(borderStr)
    }
  }
  if (content.color?.rgba || content.color_theme) {
    cssRules.color = addImportant(
      content.color?.rgba || getThemeMainColor(content.color_theme as string)
    )
  }
  if (content.background_color?.rgba || content.background_color_theme) {
    cssRules.backgroundColor = addImportant(
      content.background_color?.rgba ||
        getThemeMainColor(content.background_color_theme as string)
    )
  }
  return cssRules
}

type UseStylesAdvancedProps = {
  props?: StylesStoryblok[]
  propsTablet?: StylesStoryblok[]
  propsMobile?: StylesStoryblok[]
  propsHover?: StylesStoryblok[]
}

export const useStylesAdvanced = makeStyles<UseStylesAdvancedProps>({
  name: 'StylesAdvanced'
})((theme, { props, propsHover, propsMobile, propsTablet }) => {
  return {
    advanced: props?.[0] ? getStyles(props[0], theme) : {},
    advancedMobile: propsMobile?.[0]
      ? {
          [theme.breakpoints.only('xs')]: {
            ...getStyles(propsMobile[0], theme)
          }
        }
      : {},
    advancedTablet: propsTablet?.[0]
      ? {
          [theme.breakpoints.between('sm', 'md')]: {
            ...getStyles(propsTablet[0], theme)
          }
        }
      : {},
    advancedHover: propsHover?.[0]
      ? {
          '&:hover': {
            ...getStyles(propsHover[0], theme)
          }
        }
      : {}
  }
})
