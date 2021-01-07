import React, { FunctionComponent, useEffect, useState } from 'react'
import Drawer from '@material-ui/core/Drawer'
import { useTheme } from '@material-ui/core/styles'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useGlobalState } from '../../../utils/state/state'
import { UseBackgroundPayload } from '../../section/useBackgroundBox'
import { useStyles } from './useDrawerStyles'
import { useAppStore } from '../../../utils/state/appState'

type DrawerContainerProps = {
  backgroundProps?: UseBackgroundPayload
}
const DrawerContainer: FunctionComponent<DrawerContainerProps> = ({
  children,
  backgroundProps
}) => {
  const classes = useStyles()
  const router = useRouter()
  const asPath = router?.asPath
  const [isOpen, setOpen] = useGlobalState('leftNavigationDrawer')
  const { settings, drawerVariant } = useAppStore((state) => ({
    settings: state.settings,
    drawerVariant: state.drawerVariant
  }))
  const theme = useTheme()
  const matches = useMediaQuery(
    theme.breakpoints.down(settings?.mobile_nav_breakpoint || 'sm')
  )
  const [mountedOnce, setMountedOnce] = useState<boolean>(false)

  useEffect(() => {
    if (drawerVariant === 'temporary' || matches) {
      setOpen(false)
    }
  }, [asPath, drawerVariant, setOpen, matches])

  useEffect(() => {
    if (isOpen && !mountedOnce) {
      setMountedOnce(true)
    }
  }, [isOpen, mountedOnce])

  const classList = backgroundProps?.className
  const drawerBelowToolbar =
    settings.drawer_below_toolbar_xs || settings.drawer_below_toolbar
  return (
    <Drawer
      open={isOpen}
      SlideProps={{
        unmountOnExit: !mountedOnce
      }}
      className={clsx('lm-main__drawer', classes.leftDrawer, {
        [classes.aboveToolbar]: !drawerBelowToolbar,
        [classes.belowToolbar]: drawerBelowToolbar,
        [classes.fullWidthMobile]: !!settings.drawer_full_width_mobile
      })}
      classes={{
        paper: clsx('lm-main__drawer', classList, classes.leftDrawer, {
          [classes.aboveToolbar]: !drawerBelowToolbar,
          [classes.belowToolbar]: drawerBelowToolbar,
          [classes.fullWidthMobile]: !!settings.drawer_full_width_mobile
        })
      }}
      PaperProps={{
        style: backgroundProps?.style ? backgroundProps.style : undefined
      }}
      onClose={() => setOpen(false)}
      variant={drawerVariant}
    >
      {children}
    </Drawer>
  )
}
DrawerContainer.displayName = 'DrawerContainer'

export default DrawerContainer
