import React, { FunctionComponent, useMemo } from 'react'
import { DrawerProps } from '@material-ui/core/Drawer'
import { AppSetupContext, AppSetupProps } from '@context/AppSetupContext'
import { useAppSettings } from '@context/AppSettingsContext'
import useDeviceDimensions from '../../utils/hooks/useDeviceDimensions'

const AppSetupProvider: FunctionComponent = ({ children }) => {
  const { isMobile } = useDeviceDimensions()
  const { settings } = useAppSettings()

  let drawerVariant: DrawerProps['variant'] =
    isMobile && settings.drawer_below_toolbar_xs ? 'persistent' : 'temporary'
  if (!isMobile) {
    drawerVariant = settings.drawer_below_toolbar
      ? 'persistent'
      : settings.drawer_variant || 'temporary'
  }

  const value = useMemo<AppSetupProps>(() => {
    return {
      drawerVariant
    }
  }, [drawerVariant])

  return (
    <AppSetupContext.Provider value={value}>
      {children}
    </AppSetupContext.Provider>
  )
}
AppSetupProvider.displayName = 'AppSetupProvider'

export default AppSetupProvider
