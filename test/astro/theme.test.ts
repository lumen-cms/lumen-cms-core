import { expect, it } from 'vitest'
import { createTheme } from '@mui/material/styles'
import { createCmsTheme, typographyCss } from '../../packages/lumen-cms-shared/src/theme'
import { responsiveFontSizesCompatible } from '../../src/utils/responsiveFontSizes'

it('preserves custom palette shades and contrasts without importing MUI at runtime', () => {
  const theme = createCmsTheme({ theme_primary: '#2468ac', theme_primary_contrast: '#fafafa', theme_base: 'dark', default_font_color: '#eee' })
  const reference = createTheme({ palette: { mode: 'dark', primary: { main: '#2468ac', contrastText: '#fafafa' } } })
  expect(theme.palette.primary).toEqual(reference.palette.primary)
  expect(theme.palette.text.primary).toBe('#eee')
  expect(theme.palette.background).toEqual(reference.palette.background)
  expect(theme.shadows).toEqual(reference.shadows)
})

it('matches current responsive headline sizes including the aligned largest breakpoint', () => {
  const theme = createCmsTheme()
  const reference = responsiveFontSizesCompatible(createTheme({ typography: { fontFamily: 'Nunito' }, breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1280, xl: 1920 } } }))
  const css = typographyCss(theme)
  for (const variant of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const) {
    expect(css).toContain(`font-size:${reference.typography[variant].fontSize};`)
    for (const width of [600, 900, 1280]) {
      const key = `@media (min-width:${width}px)`
      const rule = reference.typography[variant][key] as { fontSize: string }
      expect(css).toContain(`@media(min-width:${width}px){.lm-typography-${variant}{font-size:${rule.fontSize};}}`)
    }
  }
})
