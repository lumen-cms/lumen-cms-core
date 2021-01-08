import create from 'zustand'
import { DrawerProps } from '@material-ui/core/Drawer'
import {
  GlobalStoryblok,
  PageStoryblok
} from '../../typings/generated/components-schema'

type AppStore = {
  settings: Partial<GlobalStoryblok>
  page: Partial<PageStoryblok>
  drawerVariant: DrawerProps['variant']
}

export const useAppStore = create<AppStore>(() => ({
  settings: {},
  page: {},
  drawerVariant: 'temporary'
}))

// recommended way to memoize the selectors
export const settingsSelector = (state: AppStore) => state.settings
export const pageSelector = (state: AppStore) => state.page
export const drawerVariantSelector = (state: AppStore) => state.drawerVariant
