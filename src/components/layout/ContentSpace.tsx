import * as React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import { useAppSetup } from '../provider/AppSetupProvider'
import useScrollTop from '../../utils/hooks/useScrollTop'

const useStyles = makeStyles((theme: Theme) => createStyles({
  contentSpace: {
    height: theme.toolbar.height.custom ? Number(theme.toolbar.height.custom) : theme.toolbar.height.mobile,
    transitionDuration: '500ms',
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
      height: theme.toolbar.height.custom ? Math.round(theme.toolbar.height.custom * 0.86) + theme.toolbar.height.systemBar : theme.toolbar.height.landscape + theme.toolbar.height.systemBar
    },
    [theme.breakpoints.up('sm')]: {
      height: theme.toolbar.height.custom ? Math.round(theme.toolbar.height.custom * 1.15) + theme.toolbar.height.systemBar : theme.toolbar.height.desktop + theme.toolbar.height.systemBar
    },
    '&.lm-scrolled': {
      height: theme.toolbar.height.mobile,
      [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
        height: theme.toolbar.height.landscape //+ theme.toolbar.height.systemBar
      },
      [theme.breakpoints.up('sm')]: {
        height: theme.toolbar.height.desktop //+ theme.toolbar.height.systemBar
      }
    }
  }
}))

function ContentSpace(): JSX.Element {
  const classes = useStyles()
  const appSetup = useAppSetup()
  const scrolledWithoutHysteresis = useScrollTop()

  return (
    <div className={clsx('lm-content-space',
      classes.contentSpace, {
        'lm-scrolled': scrolledWithoutHysteresis && (appSetup.toolbarMainHeight || appSetup.hasFeatureImage)
      })} />
  )
}

export default ContentSpace
