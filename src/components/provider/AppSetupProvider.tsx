import * as React from 'react'
import { createContext, FunctionComponent, useContext, useMemo } from 'react'
import { DrawerProps } from '@material-ui/core/Drawer'
import { GlobalStoryblok, PageStoryblok } from '../../typings/generated/components-schema'
import { useWindowDimensions } from './WindowDimensionsProvider'

export type AppSetupProps = {
  hasDrawer?: boolean,
  hasFeatureImage?: boolean | null,
  hasRightDrawer?: boolean | null,
  drawerVariant?: DrawerProps['variant']
  drawerBelowToolbar?: boolean
  hasScrollCollapse?: boolean
  toolbarMainHeight?: string | number
  drawerFullWidthMobile?: boolean
  rightDrawerMediaBreakpoint?: PageStoryblok['mobile_breakpoint']
  leftDrawerMediaBreakpoint?: GlobalStoryblok['mobile_nav_breakpoint']
}

const defaultValue: AppSetupProps = {
  hasDrawer: false,
  hasFeatureImage: false,
  hasRightDrawer: false,
  drawerVariant: 'temporary',
  drawerBelowToolbar: false,
  hasScrollCollapse: false
}
const AppSetupContext = createContext(defaultValue)

const AppSetupProvider: FunctionComponent<{
  settings: GlobalStoryblok
  page?: PageStoryblok | null
}> = ({ children, settings, page }) => {
  const { isMobile } = useWindowDimensions()
  const hasDrawer = Array.isArray(settings.drawer_body) && settings.drawer_body.length > 0
  const hasFeatureImage = page && Array.isArray(page.property) && page.property.includes('has_feature')
  const hasRightDrawer = page && Array.isArray(page.right_body) && page.right_body?.length > 0
  const hasScrollCollapse = !!(settings.toolbar_config && settings.toolbar_config.includes('scroll_collapse'))
  let drawerVariant: DrawerProps['variant'] = isMobile && settings.drawer_below_toolbar_xs ? 'persistent' : 'temporary'
  if (!isMobile) {
    drawerVariant = settings.drawer_below_toolbar ? 'persistent' : settings.drawer_variant || 'temporary'
  }
  const toolbarMainHeight = settings.toolbar_main_height
  const drawerBelowToolbar = settings.drawer_below_toolbar_xs || settings.drawer_below_toolbar
  const drawerFullWidthMobile = !!settings.drawer_full_width_mobile
  const rightDrawerMediaBreakpoint = page?.mobile_breakpoint
  const leftDrawerMediaBreakpoint = settings?.mobile_nav_breakpoint

  const value = useMemo<AppSetupProps>(
    () => {
      return {
        hasDrawer,
        hasFeatureImage,
        hasRightDrawer,
        hasScrollCollapse,
        toolbarMainHeight,
        drawerVariant,
        drawerBelowToolbar,
        drawerFullWidthMobile,
        rightDrawerMediaBreakpoint,
        leftDrawerMediaBreakpoint
      }
    },
    [hasDrawer, hasFeatureImage, hasRightDrawer, hasScrollCollapse, toolbarMainHeight, drawerVariant, drawerBelowToolbar, drawerFullWidthMobile, rightDrawerMediaBreakpoint, leftDrawerMediaBreakpoint]
  )

  return (
    <AppSetupContext.Provider value={value}>
      {children}
    </AppSetupContext.Provider>
  )
}
AppSetupProvider.displayName = 'AppSetupProvider'

export const useAppSetup = () => useContext(AppSetupContext)

export default AppSetupProvider
