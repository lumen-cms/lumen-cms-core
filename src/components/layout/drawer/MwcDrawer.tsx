import React, { FunctionComponent, useEffect, useState } from 'react'
import Drawer from '@material-ui/core/Drawer'
import { useTheme } from '@material-ui/core/styles'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useAppSetup } from '@context/AppSetupContext'
import { useAppSettings } from '@context/AppSettingsContext'
import { useGlobalState } from '../../../utils/state/state'
import { UseBackgroundPayload } from '../../section/useBackgroundBox'
import { useStyles } from './useDrawerStyles'

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
  const appSetup = useAppSetup()
  const { settings } = useAppSettings()
  const theme = useTheme()
  const matches = useMediaQuery(
    theme.breakpoints.down(settings?.mobile_nav_breakpoint || 'sm')
  )
  const [mountedOnce, setMountedOnce] = useState<boolean>(false)

  useEffect(() => {
    if (appSetup.drawerVariant === 'temporary' || matches) {
      setOpen(false)
    }
  }, [asPath, appSetup.drawerVariant, setOpen, matches])

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
      variant={appSetup.drawerVariant}
    >
      {children}
    </Drawer>
  )
}
DrawerContainer.displayName = 'DrawerContainer'

export default DrawerContainer
