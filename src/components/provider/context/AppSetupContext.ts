import { DrawerProps } from '@material-ui/core/Drawer'
import { GlobalStoryblok, PageStoryblok } from '../../../typings/generated/components-schema'
import { createContext, useContext } from 'react'

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

export const AppSetupContext = createContext(defaultValue)
export const useAppSetup = () => useContext(AppSetupContext)
