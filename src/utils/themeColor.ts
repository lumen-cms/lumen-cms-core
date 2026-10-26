import type { Theme } from '@mui/material/styles'

/** CMS values include both legacy Typography aliases and palette paths. */
export function typographyColor(color?: string): string | undefined {
  if (!color) return undefined
  const aliases: Record<string, string> = {
    primary: 'primary.main',
    secondary: 'secondary.main',
    error: 'error.main',
    warning: 'warning.main',
    info: 'info.main',
    success: 'success.main',
    textPrimary: 'text.primary',
    textSecondary: 'text.secondary',
    textDisabled: 'text.disabled'
  }
  return aliases[color] || color
}

/** Resolve the palette paths stored in Storyblok, such as primary.main. */
export function getThemeColor(
  theme: Theme,
  group: string,
  shade: string
): string | undefined {
  const paletteEntry: unknown = theme.palette[group as keyof Theme['palette']]
  if (!paletteEntry || typeof paletteEntry !== 'object') return undefined
  const value = (paletteEntry as Record<string, unknown>)[shade]
  return typeof value === 'string' ? value : undefined
}
