import React, { FC, useEffect } from 'react'
import { DrawerProps } from '@mui/material/Drawer'
import useDeviceDimensions from '../../utils/hooks/useDeviceDimensions'
import { useSettings } from './SettingsPageProvider'
import { useNavigationStore } from '../../utils/state/navigationState'

const AppSetupProvider: FC = ({ children }) => {
  const { isMobile } = useDeviceDimensions()
  const settings = useSettings()
  const { drawer_variant, drawer_below_toolbar, drawer_below_toolbar_xs } =
    settings
  useEffect(() => {
    let dV: DrawerProps['variant'] =
      isMobile && drawer_below_toolbar_xs ? 'persistent' : 'temporary'
    if (!isMobile) {
      dV = drawer_below_toolbar ? 'persistent' : drawer_variant || 'temporary'
    }
    useNavigationStore.setState({
      drawerVariant: dV
    })
  }, [isMobile, drawer_below_toolbar, drawer_variant, drawer_below_toolbar_xs])

  return <>{children}</>
}
AppSetupProvider.displayName = 'AppSetupProvider'

export default AppSetupProvider
