import { memo } from 'react'
import { createGlobalStyles } from '../../utils/hooks/useGlobalStyles'
import { GlobalStyles } from '@mui/material'
import { Theme, useTheme } from '@mui/material/styles'
import { GlobalStylesProps as StyledGlobalStylesProps } from '@mui/styled-engine/GlobalStyles/GlobalStyles'

export const LmGlobalStyles = memo(() => {
  const theme = useTheme()
  // useGlobalStyles()
  return (
    <GlobalStyles
      styles={
        createGlobalStyles(theme) as StyledGlobalStylesProps<Theme>['styles']
      }
    />
  )
})
LmGlobalStyles.displayName = 'GlobalStyles'
