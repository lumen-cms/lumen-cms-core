import React, { FunctionComponent, useEffect } from 'react'
import { useGlobalState } from '../../../utils/state/state'
import Drawer, { DrawerProps } from '@material-ui/core/Drawer'
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useAppSetup } from '../../provider/AppSetupProvider'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { UseBackgroundPayload } from '../../section/useBackgroundBox'


export const useStyles = makeStyles((theme: Theme) => createStyles({
  leftDrawer: {
    width: theme.drawer.left,
    '& a': {
      color: 'inherit'
    }
  },
  aboveToolbar: {
    zIndex: theme.zIndex.drawer + 2
  },
  belowToolbar: {
    zIndex: theme.zIndex.appBar - 1
  },
  fullWidthMobile: {
    [theme.breakpoints.only('xs')]: {
      width: '100%'
    }
  }
}))

type DrawerContainerProps = {
  backgroundProps?: UseBackgroundPayload
}
const DrawerContainer: FunctionComponent<DrawerContainerProps> = ({ children, backgroundProps }) => {
  const classes = useStyles()
  const router = useRouter()
  const asPath = router?.asPath
  const [isOpen, setOpen] = useGlobalState('leftNavigationDrawer')
  const appSetup = useAppSetup()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up(appSetup.leftDrawerMediaBreakpoint || 'sm'))


  const drawerProps: DrawerProps = {
    variant: appSetup.drawerVariant
  }

  useEffect(
    () => {
      if (appSetup.drawerVariant === 'temporary' || matches) {
        setOpen(false)
      }
    },
    [asPath, appSetup, setOpen, matches]
  )

  const classList = backgroundProps?.className
  return (
    <Drawer open={isOpen}
            className={clsx('lm-main__drawer', classes.leftDrawer, {
              [classes.aboveToolbar]: !appSetup.drawerBelowToolbar,
              [classes.belowToolbar]: appSetup.drawerBelowToolbar,
              [classes.fullWidthMobile]: appSetup.drawerFullWidthMobile
            })}
            classes={{
              paper: clsx(
                'lm-main__drawer',
                classList,
                classes.leftDrawer,
                {
                  [classes.aboveToolbar]: !appSetup.drawerBelowToolbar,
                  [classes.belowToolbar]: appSetup.drawerBelowToolbar,
                  [classes.fullWidthMobile]: appSetup.drawerFullWidthMobile
                })
            }}
            PaperProps={{
              style: backgroundProps?.style ? backgroundProps.style : undefined
            }}
            onClose={() => setOpen(false)}
            {...drawerProps}>
      {children}
    </Drawer>
  )
}
DrawerContainer.displayName = 'DrawerContainer'

export default DrawerContainer
