import React, { FC, useEffect } from 'react'
import { DrawerProps } from '@material-ui/core/Drawer'
import useDeviceDimensions from '../../utils/hooks/useDeviceDimensions'
import { useAppStore } from '../../utils/state/appState'

const AppSetupProvider: FC = ({ children }) => {
  const { isMobile } = useDeviceDimensions()
  const settings = useAppStore((state) => state.settings)
  const {
    drawer_variant,
    drawer_below_toolbar,
    drawer_below_toolbar_xs
  } = settings
  useEffect(() => {
    let dV: DrawerProps['variant'] =
      isMobile && drawer_below_toolbar_xs ? 'persistent' : 'temporary'
    if (!isMobile) {
      dV = drawer_below_toolbar ? 'persistent' : drawer_variant || 'temporary'
    }
    useAppStore.setState({
      drawerVariant: dV
    })
  }, [isMobile, drawer_below_toolbar, drawer_variant, drawer_below_toolbar_xs])

  return <>{children}</>
}
AppSetupProvider.displayName = 'AppSetupProvider'

export default AppSetupProvider
