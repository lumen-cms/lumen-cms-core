import create, { State } from 'zustand'
import { DrawerProps } from '@material-ui/core/Drawer'
import React, { createContext, FC, useContext, useMemo } from 'react'
import {
  GlobalStoryblok,
  PageStoryblok
} from '../../typings/generated/components-schema'

type AppStore = {
  settings: Partial<GlobalStoryblok>
  page: Partial<PageStoryblok>
  drawerVariant: DrawerProps['variant']
  setSettings: (settings: GlobalStoryblok) => void
  setPage: (page: PageStoryblok) => void
}

let store: AppStore | undefined

const noop = () => {
  //
}
const initialState: AppStore = {
  settings: {},
  page: {},
  drawerVariant: 'temporary',
  setSettings: noop,
  setPage: noop
}

const initStore = (preloadedState = initialState) =>
  create<AppStore>((set) => ({
    ...initialState,
    ...preloadedState,
    setSettings: (settings) => {
      set({ settings })
    },
    setPage: (page) => {
      set({ page })
    }
  }))

const initializeStore = (preloadedState) => {
  let _store = store ?? initStore(preloadedState)

  // After navigating to a page with an initial Zustand state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!store) {
    store = _store
  }

  return _store
}

// run this in _app
export function useHydrate(initProps: any) {
  const currentStore = useMemo(() => initializeStore(initProps), [initProps])
  return currentStore
}

export const StoreContext = createContext<AppStore | null>(null)

export const AppStoreProvider: FC<{ store: AppStore }> = ({
  children,
  store
}) => {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export const useAppStore = (
  selector: (state: AppStore) => Partial<AppStore>,
  eqFn?: () => void
): GlobalStoryblok | PageStoryblok => {
  const appStore = useContext(StoreContext)
  const values = appStore(selector, eqFn)

  return values as GlobalStoryblok | PageStoryblok
}

// recommended way to memoize the selectors
export const settingsSelector = (state: AppStore) => state.settings
export const pageSelector = (state: AppStore) => state.page
export const drawerVariantSelector = (state: AppStore) => state.drawerVariant
