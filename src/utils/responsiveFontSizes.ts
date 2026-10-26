import { responsiveFontSizes, type Theme } from '@mui/material/styles'

type Options = NonNullable<Parameters<typeof responsiveFontSizes>[1]>

/** Preserve MUI 5's four-pixel line-height alignment at the largest breakpoint. */
export function responsiveFontSizesCompatible(
  theme: Theme,
  options: Options = {}
) {
  const result = responsiveFontSizes(theme, options)
  if (options.disableAlign) return result
  const breakpoints = options.breakpoints || ['sm', 'md', 'lg']
  const largest = breakpoints[breakpoints.length - 1]
  if (!largest) return result
  const variants = options.variants || [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'subtitle1',
    'subtitle2',
    'body1',
    'body2',
    'caption',
    'button',
    'overline'
  ]
  for (const variant of variants) {
    const style = theme.typography[variant]
    const target = result.typography[variant]
    if (
      !style ||
      typeof style !== 'object' ||
      !target ||
      typeof target !== 'object'
    )
      continue
    const size = String(style.fontSize)
    const rem =
      size.endsWith('rem') || size.endsWith('em')
        ? parseFloat(size)
        : Number((parseFloat(size) / theme.typography.htmlFontSize).toFixed(5))
    if (rem <= 1) continue
    const grid = 4 / (Number(style.lineHeight) * theme.typography.htmlFontSize)
    const below = rem - (rem % grid)
    const above = below + grid
    const aligned = rem - below < above - rem ? below : above
    Object.assign(target, {
      [`@media (min-width:${theme.breakpoints.values[largest]}px)`]: {
        fontSize: `${Math.round(aligned * 10000) / 10000}rem`
      }
    })
  }
  return result
}
