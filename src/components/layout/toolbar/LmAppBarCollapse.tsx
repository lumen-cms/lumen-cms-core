import React, { FC } from 'react'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import { Collapse } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import clsx from 'clsx'

// styled instead of sx: sx hoists the md breakpoint above the landscape
// media query, which would then override the custom toolbar height.
const AppBarCollapse = styled(Collapse)(({ theme }) => ({
  '&.lm-collapsed': {
    '& .logo-img': {
      maxHeight: '40px'
    }
  },
  // the wrapper can't use hidden because its not entirely hidden..
  '& > .MuiCollapse-wrapper': {
    height: '100%'
  },
  '&.MuiCollapse-entered .lm-toolbar__main': {
    minHeight: `${theme.toolbar.height.mobile}px`,
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
      minHeight: `${theme.toolbar.height.landscape}px`
    },
    [theme.breakpoints.up('md')]: {
      minHeight: theme.toolbar.height.custom
        ? `${Math.round(theme.toolbar.height.custom * 1.15)}px`
        : `${theme.toolbar.height.desktop}px`
    }
  }
}))

const LmAppBarCollapse: FC<React.PropsWithChildren<unknown>> = ({
  children
}) => {
  const trigger = useScrollTrigger({ disableHysteresis: true })
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('md'))
  if (!theme.toolbar.height.custom || !matches) {
    return <>{children}</>
  }
  return (
    <AppBarCollapse
      in={!trigger}
      className={clsx({ 'lm-collapsed': trigger })}
      collapsedSize={theme.toolbar.height.desktop}
    >
      {children}
    </AppBarCollapse>
  )
}

export default LmAppBarCollapse
