import React, { FunctionComponent, useEffect, useState } from 'react'
import Drawer from '@material-ui/core/Drawer'
import { useTheme } from '@material-ui/core/styles'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { UseBackgroundPayload } from '../../section/useBackgroundBox'
import { useStyles } from './useDrawerStyles'
import { useSettings } from '../../provider/SettingsPageProvider'
import {
  closeLeftNavigationSelector,
  drawerVariantSelector,
  leftNavigationDrawerSelector,
  useNavigationStore
} from '../../../utils/state/navigationState'

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
  // const [isOpen, setOpen] = useGlobalState('leftNavigationDrawer')
  const leftNavigationDrawer = useNavigationStore(leftNavigationDrawerSelector)
  const closeDrawer = useNavigationStore(closeLeftNavigationSelector)
  const drawerVariant = useNavigationStore(drawerVariantSelector)
  const settings = useSettings()
  const theme = useTheme()
  const matches = useMediaQuery(
    theme.breakpoints.down(settings?.mobile_nav_breakpoint || 'sm')
  )
  const [mountedOnce, setMountedOnce] = useState<boolean>(false)

  useEffect(() => {
    if (drawerVariant === 'temporary' || matches) {
      closeDrawer()
    }
  }, [asPath, drawerVariant, closeDrawer, matches])

  useEffect(() => {
    if (leftNavigationDrawer && !mountedOnce) {
      setMountedOnce(true)
    }
  }, [leftNavigationDrawer, mountedOnce])

  const classList = backgroundProps?.className
  const drawerBelowToolbar =
    settings.drawer_below_toolbar_xs || settings.drawer_below_toolbar
  return (
    <Drawer
      open={leftNavigationDrawer}
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
      onClose={closeDrawer}
      variant={drawerVariant}
    >
      {children}
    </Drawer>
  )
}
DrawerContainer.displayName = 'DrawerContainer'

export default DrawerContainer
