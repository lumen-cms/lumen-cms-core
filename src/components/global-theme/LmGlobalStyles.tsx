import { memo } from 'react'
import GlobalStyles from '@mui/material/GlobalStyles'
import { createGlobalStyles } from '../../utils/hooks/useGlobalStyles'

export const LmGlobalStyles = memo(() => (
  <GlobalStyles styles={createGlobalStyles} />
))
LmGlobalStyles.displayName = 'GlobalStyles'
