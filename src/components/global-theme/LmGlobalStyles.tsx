import { memo } from 'react'
import { createGlobalStyles } from '../../utils/hooks/useGlobalStyles'
import { GlobalStyles } from '@mui/material'
import { useTheme } from '@mui/material/styles'

export const LmGlobalStyles = memo(() => {
  const theme = useTheme()
  // useGlobalStyles()
  return <GlobalStyles styles={createGlobalStyles(theme)} />
})
LmGlobalStyles.displayName = 'GlobalStyles'
