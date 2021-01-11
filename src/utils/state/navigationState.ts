import create from 'zustand'
import { DrawerProps } from '@material-ui/core/Drawer'

type NavigationStore = {
  drawerVariant: DrawerProps['variant']
  leftNavigationDrawer: boolean
  closeLeftDrawer: () => void
  toggleLeftDrawer: () => void
  closeRightDrawer: () => void
  toggleRightDrawer: () => void
  rightNavigationDrawer: boolean
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  drawerVariant: 'temporary',
  leftNavigationDrawer: false,
  closeLeftDrawer: () => set(() => ({ leftNavigationDrawer: false })),
  toggleLeftDrawer: () =>
    set((state) => ({ leftNavigationDrawer: !state.leftNavigationDrawer })),
  rightNavigationDrawer: false,
  closeRightDrawer: () => set(() => ({ rightNavigationDrawer: false })),
  toggleRightDrawer: () =>
    set((state) => ({ rightNavigationDrawer: !state.rightNavigationDrawer }))
}))

export const drawerVariantSelector = (state: NavigationStore) =>
  state.drawerVariant

export const leftNavigationDrawerSelector = (state: NavigationStore) =>
  state.leftNavigationDrawer
export const closeLeftNavigationSelector = (state: NavigationStore) =>
  state.closeLeftDrawer
export const toggleLeftNavigationSelector = (state: NavigationStore) =>
  state.toggleLeftDrawer
export const rightNavigationDrawerSelector = (state: NavigationStore) =>
  state.rightNavigationDrawer
export const closeRightNavigationSelector = (state: NavigationStore) =>
  state.closeRightDrawer
export const toggleRightNavigationSelector = (state: NavigationStore) =>
  state.toggleRightDrawer
