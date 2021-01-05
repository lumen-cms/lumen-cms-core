import { memo } from 'react'
import useGlobalStyles from '../../utils/hooks/useGlobalStyles'

export const GlobalStyles = memo(() => {
  useGlobalStyles()
  return null
})
GlobalStyles.displayName = 'GlobalStyles'
