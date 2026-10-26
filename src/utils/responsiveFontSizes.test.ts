import { expect, it } from 'vitest'
import { createTheme } from '@mui/material/styles'
import { responsiveFontSizesCompatible } from './responsiveFontSizes'

it('retains the pre-upgrade heading sizes at desktop breakpoints', () => {
  const theme = responsiveFontSizesCompatible(createTheme())
  // Values recorded from MUI 5.12.3, including its four-pixel line-height grid.
  for (const [variant, fontSize] of Object.entries({
    h1: '5.9983rem',
    h2: '3.75rem',
    h3: '2.9991rem',
    h4: '2.0243rem',
    h5: '1.4993rem',
    h6: '1.25rem'
  })) {
    expect(theme.typography[variant as 'h1']).toHaveProperty(
      '@media (min-width:1200px)',
      { fontSize }
    )
  }
})

it('leaves opt-out typography unaligned and does not mutate the source theme', () => {
  const original = createTheme()
  const theme = responsiveFontSizesCompatible(original, { disableAlign: true })
  expect(theme.typography.h4).toHaveProperty('@media (min-width:1200px)', {
    fontSize: '2.125rem'
  })
  expect(original.typography.h4).not.toHaveProperty('@media (min-width:1200px)')
})
