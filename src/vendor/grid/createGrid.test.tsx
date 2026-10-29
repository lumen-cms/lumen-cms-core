import { renderToStaticMarkup } from 'react-dom/server'
import { forwardRef } from 'react'
import { expect, it } from 'vitest'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import createGrid from './createGrid'
import type { GridOwnerState } from './GridProps'

it('inherits nested spacing and overflow while respecting explicit zero and child overrides', () => {
  const states: GridOwnerState[] = []
  const Root = forwardRef<HTMLDivElement, any>(function Root(
    { ownerState, children },
    ref
  ) {
    states.push(ownerState)
    return <div ref={ref}>{children}</div>
  })
  const Grid = createGrid({ createStyledComponent: (() => Root) as any })
  const theme = createTheme({
    ...createTheme(),
    components: {
      MuiGrid2: {
        defaultProps: { columns: 16, spacing: 3, disableEqualOverflow: true }
      }
    }
  })
  renderToStaticMarkup(
    <ThemeProvider theme={theme}>
      <Grid container>
        <Grid container xs={6} mdOffset={1} rowSpacing={0}>
          <Grid container spacing={0} disableEqualOverflow={false}>
            Item
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
  expect(states[0]).toMatchObject({
    level: 0,
    columns: 16,
    spacing: 3,
    rowSpacing: 3,
    columnSpacing: 3,
    disableEqualOverflow: true
  })
  expect(states[1]).toMatchObject({
    level: 1,
    columns: undefined,
    spacing: undefined,
    rowSpacing: 0,
    columnSpacing: undefined,
    disableEqualOverflow: true,
    gridSize: { xs: 6 },
    gridOffset: { md: 1 }
  })
  expect(states[2]).toMatchObject({
    level: 2,
    spacing: 0,
    rowSpacing: 0,
    columnSpacing: 0,
    disableEqualOverflow: false,
    parentDisableEqualOverflow: true
  })
})
