import { CSSObject, Theme } from '@mui/material/styles'
import { SystemStyleObject } from '@mui/system'
import { getThemeColor } from '../themeColor'

import {
  ItemKeyValueStoryblok,
  StylesStoryblok
} from '../../typings/generated/components-schema'

const addImportant = (value?: string) =>
  value ? `${value} !important` : undefined
const snakeToCamelCase = (key: string) =>
  key.replace(/_([a-z])/g, (_, m) => m.toUpperCase())

const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1)

export const cssKeyToCamelCase = (key: string) => {
  const trimmed = key.trim()
  if (!trimmed || trimmed.startsWith('--')) {
    return trimmed
  }
  return trimmed
    .replace(/^-ms-/, 'ms-')
    .replace(/^-([a-z])/, (_, m) => m.toUpperCase())
    .replace(/-([a-z])/g, (_, m) => m.toUpperCase())
}

export const getStyles = (content: StylesStoryblok, theme: Theme) => {
  const getThemeMainColor = (color: string) => {
    const parts = color.split('.')
    return getThemeColor(theme, parts[0], parts[1] || 'main')
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
          const cssKey = cssKeyToCamelCase(k.key ?? '')
          const cssValue = k.value_color?.rgba || k.value
          if (!cssKey || !cssValue) {
            return
          }
          cssRules[cssKey] = cssValue
        })
      }
    } else if (content[key]) {
      const value = content[key]
      const curVal =
        value && typeof value === 'object' && 'rgba' in value
          ? value.rgba
          : value
      if (!curVal) {
        return
      }
      cssRules[snakeToCamelCase(key)] = addImportant(String(curVal))
    }
  })
  // edge cases
  if (content.box_shadow || content.elevation) {
    cssRules.boxShadow = content.elevation
      ? theme.shadows[Number(content.elevation)]
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

type AdvancedStylesProps = {
  props?: StylesStoryblok[]
  propsTablet?: StylesStoryblok[]
  propsMobile?: StylesStoryblok[]
  propsHover?: StylesStoryblok[]
}

export type AdvancedSx = ((theme: Theme) => SystemStyleObject<Theme>) | false

// Same hyphenation as emotion, so the emitted CSS is unchanged.
const hyphenate = (key: string) =>
  key.startsWith('--') ? key : key.replace(/[A-Z]|^ms/g, '-$&').toLowerCase()

// sx turns unitless numbers up to 1 into percentages and palette paths into
// theme colors. Such raw values were invalid CSS, so they are dropped. Zero
// lengths stay, as sx renders them equivalently ('0%').
const isReinterpretedBySx = (key: string, value: unknown, theme: Theme) => {
  if (typeof value !== 'string') {
    return false
  }
  if (key === 'width' || key === 'height') {
    const number = Number(value)
    return number <= 1 && !(value.trim() && number === 0)
  }
  if (key === 'color' && value !== 'grey') {
    return !!value
      .split('.')
      .reduce<any>((palette, path) => palette?.[path], theme.palette)
  }
  return false
}

// sx also resolves camelCase keys against the theme (boxShadow '2' becomes
// theme.shadows[2], maxWidth 'sm' a breakpoint). Kebab-case keys are passed
// through, so CMS values render verbatim.
const getCmsDeclarations = (
  content: StylesStoryblok,
  theme: Theme
): Record<string, unknown> => {
  const declarations: Record<string, unknown> = getStyles(content, theme)
  return Object.fromEntries(
    Object.entries(declarations)
      .filter(([key, value]) => !isReinterpretedBySx(key, value, theme))
      .map(([key, value]) => [hyphenate(key), value])
  )
}

export const getAdvancedSx = ({
  props,
  propsHover,
  propsMobile,
  propsTablet
}: AdvancedStylesProps): AdvancedSx => {
  if (
    !props?.[0] &&
    !propsMobile?.[0] &&
    !propsTablet?.[0] &&
    !propsHover?.[0]
  ) {
    return false
  }
  return (theme) => {
    const sx: Record<string, unknown> = props?.[0]
      ? { ...getCmsDeclarations(props[0], theme) }
      : {}
    if (propsMobile?.[0]) {
      sx[theme.breakpoints.only('xs')] = getCmsDeclarations(
        propsMobile[0],
        theme
      )
    }
    if (propsTablet?.[0]) {
      sx[theme.breakpoints.between('sm', 'md')] = getCmsDeclarations(
        propsTablet[0],
        theme
      )
    }
    if (propsHover?.[0]) {
      sx['&:hover'] = getCmsDeclarations(propsHover[0], theme)
    }
    return sx as SystemStyleObject<Theme>
  }
}
