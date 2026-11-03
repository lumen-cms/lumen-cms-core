import { shadowEffectsCss } from './shadowEffects'
import defaults from './vendor/theme-defaults.json'
import { cmsGlobalCss } from './globalCss'
import { darken, lighten } from './vendor/colorManipulator.js'
import { cmsBreakpoints, type StyleTheme } from './styles'
import type { GlobalStoryblok } from 'lumen-cms-shared/core/typings/generated/components-schema'

type PaletteColor = { main: string; light: string; dark: string; contrastText: string }
type TypographyRule = { fontFamily: string; fontWeight: number; fontSize: string; lineHeight: number; textTransform?: string }
export interface CmsTheme extends StyleTheme {
  palette: Record<string, unknown> & {
    primary: PaletteColor; secondary: PaletteColor;
    text: { primary: string; secondary: string; disabled: string }
    background: { default: string; paper: string }
    common: { white: string; black: string }
  }
  fontFamily: string
  alternativeFonts: string[]
  defaultContainerWidth: string | false
  typography: Record<string, TypographyRule>
  mode: 'light' | 'dark'
}

const font = (value: string) => value.split(':')[0].replace(/\+/g, ' ')
export function createCmsTheme(settings: Partial<GlobalStoryblok> = {}, fonts: Record<string, string | undefined> = {}): CmsTheme {
  const mode = settings.theme_base === 'dark' ? 'dark' : 'light'
  const palette = structuredClone(defaults[mode]) as CmsTheme['palette']
  for (const key of ['primary', 'secondary', 'error', 'success', 'info', 'warning'] as const) {
    const value = settings[`theme_${key}`]
    const original = palette[key] as PaletteColor
    const main = value || original.main
    palette[key] = { main, light: lighten(main, 0.2), dark: darken(main, 0.2 * 1.5), contrastText: settings[`theme_${key}_contrast`] || original.contrastText }
  }
  const grey = palette.grey as Record<string, string>
  Object.assign(grey, { main: '#e0e0e0', light: lighten('#e0e0e0', 0.2), dark: darken('#e0e0e0', 0.2 * 1.5), contrastText: 'rgba(0, 0, 0, 0.87)' })
  if (settings.default_font_color) palette.text.primary = settings.default_font_color
  if (settings.body_background_color?.rgba) palette.background.default = settings.body_background_color.rgba
  const fontFamily = fonts.default || font(settings.theme_font_default || 'Nunito')
  const typography: Record<string, TypographyRule> = {}
  for (const [key, value] of Object.entries(defaults.typography)) {
    if (value && typeof value === 'object' && 'fontSize' in value) typography[key] = { ...value, fontFamily } as TypographyRule
  }
  return {
    mode, palette, typography, fontFamily,
    alternativeFonts: [1, 2, 3, 4].map(i => fonts[`alt${i}`] || font(String(settings[`theme_font_alt${i}`] || ''))),
    defaultContainerWidth: settings.theme_container_width === 'none' ? false : settings.theme_container_width || 'lg',
    shadows: defaults.shadows, breakpoints: cmsBreakpoints
  }
}

const escapeCss = (value: unknown) => String(value).replace(/</g, '\\3c ')
const round = (n: number) => Math.round(n * 10000) / 10000
/** Preserve the current responsiveFontSizesCompatible four-pixel line alignment. */
export function typographyCss(theme: CmsTheme): string {
  let css = ''
  for (const [key, rule] of Object.entries(theme.typography)) {
    const max = parseFloat(rule.fontSize)
    const min = max > 1 ? 1 + (max - 1) / 2 : max
    const selector = `.lm-typography-${key}`
    // Grid child spacing must outrank Typography's default margin reset, just
    // as the more specific legacy grid selectors outrank MUI Typography.
    css += `@layer components{${selector}{margin:0;}}`
    css += `${selector}{font-family:var(--lm-font);font-weight:${rule.fontWeight};font-size:${min}rem;line-height:${rule.lineHeight};${rule.textTransform ? `text-transform:${rule.textTransform};` : ''}}`
    if (max <= 1) continue
    const grid = 4 / (rule.lineHeight * 16)
    for (const width of [600, 900, 1280]) {
      const size = min + (max - min) * width / 1280
      const below = size - size % grid
      const above = below + grid
      const aligned = size - below < above - size ? below : above
      css += `@media(min-width:${width}px){${selector}{font-size:${round(aligned)}rem;}}`
    }
  }
  return css
}

export function themeCss(theme: CmsTheme): string {
  const vars: Record<string, string> = {
    '--lm-font': theme.fontFamily,
    '--lm-button-shadow': theme.shadows[2],
    '--color-base-100': theme.palette.background.paper,
    '--color-base-200': theme.palette.background.default,
    '--color-base-300': theme.mode === 'dark' ? '#424242' : '#e0e0e0',
    '--color-base-content': theme.palette.text.primary,
    '--color-neutral': '#424242', '--color-neutral-content': '#fff',
    '--color-accent': theme.palette.secondary.main,
    '--color-accent-content': theme.palette.secondary.contrastText,
    '--radius-selector': '0.25rem', '--radius-field': '0.25rem', '--radius-box': '0.25rem',
    '--size-selector': '0.25rem', '--size-field': '0.25rem', '--border': '1px', '--depth': '0', '--noise': '0'
  }
  for (const key of ['primary', 'secondary', 'error', 'success', 'info', 'warning']) {
    const color = theme.palette[key] as PaletteColor
    vars[`--color-${key}`] = color.main
    vars[`--color-${key}-content`] = color.contrastText
  }
  // This inline stylesheet precedes collected grid rules and the CSS bundle.
  // Establish order here: a first-seen components layer must not precede base.
  let css = `@layer theme, base, components, utilities;:root{color-scheme:${theme.mode};${Object.entries(vars).map(([k,v])=>`${k}:${escapeCss(v)};`).join('')}}`
  css += `body{margin:0;font-family:var(--lm-font);font-size:1rem;line-height:1.5;color:${escapeCss(theme.palette.text.primary)};background-color:${escapeCss(theme.palette.background.default)};}`
  theme.alternativeFonts.forEach((value, i) => { if (value) css += `.lm-font-alt${i + 1}{font-family:${escapeCss(value)};}` })
  return css + typographyCss(theme) + cmsGlobalCss(theme) + shadowEffectsCss()
}
