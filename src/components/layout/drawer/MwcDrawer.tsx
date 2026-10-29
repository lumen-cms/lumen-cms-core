import React, { FunctionComponent, useEffect, useState } from 'react'
import Drawer from '@mui/material/Drawer'
import useMediaQuery from '@mui/material/useMediaQuery'
import { UseBackgroundPayload } from '../../section/useBackgroundBox'
import {
  aboveToolbarSx,
  belowToolbarSx,
  fullWidthMobileSx,
  leftDrawerSx
} from './drawerStyles'
import { useTheme } from '@mui/material/styles'
import clsx from 'clsx'
import { useSettings } from '../../provider/SettingsPageProvider'
import {
  closeLeftNavigationSelector,
  drawerVariantSelector,
  leftNavigationDrawerSelector,
  useNavigationStore
} from '../../../utils/state/navigationState'
import { useAppContext } from '../../provider/context/AppContext'

type DrawerContainerProps = {
  backgroundProps?: UseBackgroundPayload
}
const DrawerContainer: FunctionComponent<
  React.PropsWithChildren<DrawerContainerProps>
> = ({ children, backgroundProps }) => {
  const theme = useTheme()
  const { slug } = useAppContext()
  const leftNavigationDrawer = useNavigationStore(leftNavigationDrawerSelector)
  const closeDrawer = useNavigationStore(closeLeftNavigationSelector)
  const drawerVariant = useNavigationStore(drawerVariantSelector)
  const settings = useSettings()
  const matches = useMediaQuery(
    theme.breakpoints.down(settings?.mobile_nav_breakpoint || 'sm')
  )
  const [mountedOnce, setMountedOnce] = useState<boolean>(false)
  useEffect(() => {
    if (drawerVariant === 'temporary' || matches) {
      closeDrawer()
    }
  }, [slug, drawerVariant, closeDrawer, matches])

  useEffect(() => {
    if (leftNavigationDrawer && !mountedOnce) {
      setMountedOnce(true)
    }
  }, [leftNavigationDrawer, mountedOnce])

  const drawerBelowToolbar =
    settings.drawer_below_toolbar_xs || settings.drawer_below_toolbar
  const drawerSx = [
    leftDrawerSx,
    !drawerBelowToolbar && aboveToolbarSx,
    !!drawerBelowToolbar && belowToolbarSx,
    !!settings.drawer_full_width_mobile && fullWidthMobileSx
  ]
  return (
    <Drawer
      open={leftNavigationDrawer}
      className="lm-main__drawer"
      sx={drawerSx}
      onClose={closeDrawer}
      variant={drawerVariant}
      slotProps={{
        paper: {
          className: clsx('lm-main__drawer', backgroundProps?.className),
          style: backgroundProps?.style ? backgroundProps.style : undefined,
          sx: [...(backgroundProps?.sx ?? []), ...drawerSx]
        },

        transition: {
          unmountOnExit: !mountedOnce
        }
      }}
    >
      {children}
    </Drawer>
  )
}
DrawerContainer.displayName = 'DrawerContainer'

export default DrawerContainer
