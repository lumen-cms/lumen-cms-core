import { expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Grid from './index'

it('retains responsive CMS widths, negative margins and child padding', () => {
  const html = renderToStaticMarkup(
    <ThemeProvider theme={createTheme()}>
      <Grid container spacing={2}>
        <Grid xs={12} md={6}>
          Column
        </Grid>
      </Grid>
    </ThemeProvider>
  )
  expect(html).toContain('--Grid-rowSpacing:16px')
  expect(html).toContain('margin:calc(var(--Grid-rowSpacing) / -2)')
  expect(html).toContain('padding:calc(var(--Grid-rowSpacing) / 2)')
  expect(html).toContain('width:calc(100% * 12 / var(--Grid-columns))')
  expect(html).toContain('@media (min-width:900px)')
  expect(html).toContain('width:calc(100% * 6 / var(--Grid-columns))')
  expect(html).toContain('MuiGrid2-grid-xs-12 MuiGrid2-grid-md-6')
})

it('retains nested spacing inheritance and vertical layouts', () => {
  const html = renderToStaticMarkup(
    <ThemeProvider theme={createTheme()}>
      <Grid container spacing={3}>
        <Grid container xs={6} direction="column">
          <Grid xs="auto">Nested column</Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
  expect(html).toContain('--Grid-rowSpacingLevel1:var(--Grid-rowSpacing)')
  expect(html).toContain(
    'width:calc(100% * 6 / var(--Grid-columns) + var(--Grid-columnSpacingLevel1))'
  )
  expect(html).toContain('flex-direction:column')
  expect(html).toContain('MuiGrid2-direction-xs-column')
  expect(html).not.toContain('unstable_level=')
})
