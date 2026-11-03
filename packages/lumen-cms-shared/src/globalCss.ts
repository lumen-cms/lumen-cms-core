import { createGlobalStyles } from './globalStyles'
import type { CSSObject, GlobalStyleTheme } from './globalStyleTypes'
import type { CmsTheme } from './theme'

const unitless = new Set(['opacity', 'fontWeight', 'zIndex', 'flexGrow', 'lineHeight', 'webkitLineClamp'])
const hyphenate = (key: string) => key.replace(/[A-Z]|^ms/g, '-$&').toLowerCase()
export function serializeGlobalStyles(rules: CSSObject, selector = ''): string {
 let declarations = '', children = ''
 for (const [key, value] of Object.entries(rules)) {
  if (value === undefined) continue
  if (typeof value === 'object') {
   if (key.startsWith('@')) children += `${key}{${serializeGlobalStyles(value, selector)}}`
   else {
    const nested = selector ? selector.split(',').flatMap(parent => key.split(',').map(child => child.includes('&') ? child.replaceAll('&', parent.trim()) : `${parent.trim()} ${child.trim()}`)).join(',') : key
    children += serializeGlobalStyles(value, nested)
   }
  } else declarations += `${hyphenate(key)}:${typeof value === 'number' && value !== 0 && !unitless.has(key) ? `${value}px` : value};`
 }
 return (declarations ? `${selector}{${declarations}}` : '') + children
}

export function cmsGlobalCss(theme: CmsTheme): string {
 const palette = theme.palette
 const globalTheme: GlobalStyleTheme = {
  palette: { mode: theme.mode, primary: palette.primary, secondary: palette.secondary, text: palette.text, common: palette.common,
   error: palette.error as GlobalStyleTheme['palette']['error'], warning: palette.warning as { main: string }, success: palette.success as { main: string }, info: palette.info as { main: string } },
  spacing: value => `${value * 8}px`, shape: { borderRadius: 4 },
  breakpoints: { only: theme.breakpoints.only, up: value => `@media (min-width:${({ sm: 600, md: 900, lg: 1280 })[value]}px)` },
  alternativeFont: Object.fromEntries(theme.alternativeFonts.map((font, index) => [`alt${index + 1}`, font])),
  zIndex: { tooltip: 1500 }
 }
 return serializeGlobalStyles(createGlobalStyles(globalTheme)).replace(/</g, '\\3c ')
}
