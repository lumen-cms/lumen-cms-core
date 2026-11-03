// Structural theme contract: no MUI or React runtime is required.
export interface StyleTheme {
  palette: Record<string, unknown>
  shadows: readonly string[]
  breakpoints: {
    only: (key: 'xs') => string
    between: (start: 'sm', end: 'md') => string
  }
}
type Theme = StyleTheme
type CSSObject = Record<string, unknown>
type SystemStyleObject = Record<string, unknown>
const getThemeColor = (theme: Theme, group: string, shade: string) => {
  const entry = theme.palette[group]
  if (!entry || typeof entry !== 'object') return undefined
  const value = (entry as Record<string, unknown>)[shade]
  return typeof value === 'string' ? value : undefined
}

import {
  ItemKeyValueStoryblok,
  StylesStoryblok
} from 'lumen-cms-shared/core/typings/generated/components-schema'

const addImportant = (value?: string) =>
  value ? `${value} !important` : undefined
const snakeToCamelCase = (key: string) =>
  key.replace(/_([a-z])/g, (_: string, m: string) => m.toUpperCase())

const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1)

export const cssKeyToCamelCase = (key: string) => {
  const trimmed = key.trim()
  if (!trimmed || trimmed.startsWith('--')) {
    return trimmed
  }
  return trimmed
    .replace(/^-ms-/, 'ms-')
    .replace(/^-([a-z])/, (_: string, m: string) => m.toUpperCase())
    .replace(/-([a-z])/g, (_: string, m: string) => m.toUpperCase())
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
      const value: unknown = content[key]
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

export type AdvancedStylesProps = {
  props?: StylesStoryblok[]
  propsTablet?: StylesStoryblok[]
  propsMobile?: StylesStoryblok[]
  propsHover?: StylesStoryblok[]
}

export type AdvancedSx = ((theme: Theme) => SystemStyleObject) | false

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
      .reduce<unknown>(
        (palette, path) =>
          (palette as Record<string, unknown> | null | undefined)?.[path],
        theme.palette
      )
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

export const getAdvancedRules = ({
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
    return sx
  }
}

/** Preserve the exact exclusive breakpoint edges emitted by the current theme. */
export const cmsBreakpoints: StyleTheme['breakpoints'] = {
  only: () => '@media (min-width:0px) and (max-width:599.95px)',
  between: () => '@media (min-width:600px) and (max-width:899.95px)'
}

/** Render declarations without Tailwind's build-time class discovery or sx coercion.
 * selector is an application-generated class, never CMS input.
 */
export function compileBlockStyles(
  selector: string,
  props: AdvancedStylesProps,
  theme: StyleTheme
): string {
  if (!/^\.[a-zA-Z_][a-zA-Z0-9_-]*$/.test(selector)) {
    throw new Error('Block styles require a generated class selector')
  }
  const resolve = getAdvancedRules(props)
  if (!resolve) return ''
  const rules = resolve(theme)
  const declarations = (values: Record<string, unknown>) =>
    Object.entries(values)
      .filter(([, value]) => typeof value === 'string' || typeof value === 'number')
      .map(([key, value]) => `${key}:${value};`)
      .join('')
  let css = `${selector}{${declarations(rules)}}`
  for (const [key, value] of Object.entries(rules)) {
    if (!value || typeof value !== 'object') continue
    const body = declarations(value as Record<string, unknown>)
    if (key.startsWith('@media ')) css += `${key}{${selector}{${body}}}`
    else if (key === '&:hover') css += `${selector}:hover{${body}}`
  }
  // CSS escapes preserve string contents while preventing HTML style termination.
  return css.replace(/</g, '\\3c ')
}
