'use client'
import GlobalStyles from '@mui/material/GlobalStyles'
import type { Theme } from '@mui/material/styles'

// Theme CSS is emitted once during SSG; text blocks have no client implementation.
const styles = (theme: Theme) => ({
  ...Object.fromEntries(
    Object.entries(theme.typography)
      .filter(([, value]) => value && typeof value === 'object')
      .map(([variant, value]) => [
        `.lm-static-text.MuiTypography-${variant}`,
        { margin: 0, ...value }
      ])
  ),
  '.lm-static-text.lm-markup > p': {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '&:first-of-type': { marginTop: 0 },
    '&:last-of-type': { marginBottom: 0 }
  }
})
export function StaticTextStyles() {
  return <GlobalStyles styles={styles} />
}
