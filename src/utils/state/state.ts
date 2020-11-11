import { createGlobalState } from 'react-hooks-global-state'

export interface State {
  leftNavigationDrawer: boolean
  rightNavigationDrawer: boolean
  searchParams: {
    searchText: string | undefined
    categories: string[] | undefined
  }
  hasWebpSupport?: boolean
}

const initialState: State = {
  leftNavigationDrawer: false,
  rightNavigationDrawer: false,
  searchParams: {
    searchText: undefined,
    categories: undefined
  },
  hasWebpSupport: undefined
}
const { setGlobalState, useGlobalState, getGlobalState } = createGlobalState(
  initialState
)

export { useGlobalState, setGlobalState, getGlobalState }
