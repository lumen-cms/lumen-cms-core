import create from 'zustand'
import { addSearchParamsToUrl } from './actions'

type SearchStore = {
  searchText: string | undefined
  categories: string[]
  onSearchTextChange: (searchText: string) => void
  setSearchCategory: (categories: string[]) => void
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchText: undefined,
  categories: [],
  onSearchTextChange: (searchText: string) =>
    set(() => {
      addSearchParamsToUrl({ searchText })
      return {
        searchText
      }
    }),
  setSearchCategory: (categories: string[]) =>
    set(() => {
      addSearchParamsToUrl({ categories })
      return {
        categories
      }
    })
}))

export const searchTextSelector = (state: SearchStore) => state.searchText
export const categorySelector = (state: SearchStore) => state.categories
export const setSearchCategorySelector = (state: SearchStore) =>
  state.setSearchCategory
export const onSearchTextSelector = (state: SearchStore) =>
  state.onSearchTextChange
