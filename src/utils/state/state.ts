import { createGlobalState } from 'react-hooks-global-state'
import { CONFIG } from '../config'

export interface State {
  leftNavigationDrawer: boolean
  rightNavigationDrawer: boolean
  searchParams: {
    searchText: string | undefined
    categories: string[] | undefined
  }
  locale: string
  hasWebpSupport?: boolean
}

const initialState: State = {
  leftNavigationDrawer: false,
  rightNavigationDrawer: false,
  searchParams: {
    searchText: undefined,
    categories: undefined
  },
  locale: CONFIG.defaultLocale,
  hasWebpSupport: undefined
}
const { setGlobalState, useGlobalState, getGlobalState } = createGlobalState(initialState)


export { useGlobalState, setGlobalState, getGlobalState }
