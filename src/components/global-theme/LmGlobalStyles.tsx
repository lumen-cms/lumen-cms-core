import { memo } from 'react'
import { createGlobalStyles } from '../../utils/hooks/useGlobalStyles'
import { useTheme } from '@mui/material/styles'
import { GlobalStyles } from 'tss-react'

export const LmGlobalStyles = memo(() => {
  const theme = useTheme()
  // useGlobalStyles()
  return <GlobalStyles styles={createGlobalStyles(theme) as any} />
})
LmGlobalStyles.displayName = 'GlobalStyles'
