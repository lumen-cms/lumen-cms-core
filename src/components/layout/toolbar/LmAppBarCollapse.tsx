import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles'
import React, { FC } from 'react'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import { Collapse } from '@material-ui/core'
import clsx from 'clsx'

const collapsedStyles = makeStyles((theme) =>
  createStyles({
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
        minHeight: theme.toolbar.height.custom
          ? `${theme.toolbar.height.custom}px`
          : `${theme.toolbar.height.mobile}px`,
        [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
          minHeight: theme.toolbar.height.custom
            ? `${Math.round(theme.toolbar.height.custom * 0.86)}px`
            : `${theme.toolbar.height.landscape}px`
        },
        [theme.breakpoints.up('sm')]: {
          minHeight: theme.toolbar.height.custom
            ? `${Math.round(theme.toolbar.height.custom * 1.15)}px`
            : `${theme.toolbar.height.desktop}px`
        }
      }
    }
  })
)

const LmAppBarCollapse: FC = ({ children }) => {
  const trigger = useScrollTrigger({ disableHysteresis: true })
  const theme = useTheme()
  const classes = collapsedStyles()
  if (!theme.toolbar.height.custom) {
    return <>{children}</>
  }
  return (
    <Collapse
      in={!trigger}
      className={clsx(classes.collapsed, { 'lm-collapsed': trigger })}
      classes={{
        wrapper: classes.wrapper, // we cant use hidden because its not entirely hidden..
        entered: classes.beforeCollapse
      }}
      collapsedHeight={theme.toolbar.height.desktop}
    >
      {children}
    </Collapse>
  )
}

export default LmAppBarCollapse
