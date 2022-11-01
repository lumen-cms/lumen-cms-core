import React, { FC } from 'react'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import { Collapse } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles({ name: 'AppBarCollapse' })((theme) => ({
  wrapper: {
    height: '100%'
  },
  collapsed: {
    '&.lm-collapsed': {
      '& .logo-img': {
        maxHeight: '40px'
      }
    }
  },
  beforeCollapse: {
    '& .lm-toolbar__main': {
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
  }
}))

const LmAppBarCollapse: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const trigger = useScrollTrigger({ disableHysteresis: true })
  const { classes, cx, theme } = useStyles()
  const matches = useMediaQuery(theme.breakpoints.up('md'))
  if (!theme.toolbar.height.custom || !matches) {
    return <>{children}</>
  }
  return (
    <Collapse
      in={!trigger}
      className={cx(classes.collapsed, { 'lm-collapsed': trigger })}
      classes={{
        wrapper: classes.wrapper, // we cant use hidden because its not entirely hidden..
        entered: classes.beforeCollapse
      }}
      collapsedSize={theme.toolbar.height.desktop}
    >
      {children}
    </Collapse>
  )
}

export default LmAppBarCollapse
