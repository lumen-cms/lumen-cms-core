import { useRouter } from 'next/router'
import { AllStoryData } from '../../typings/app'
import {
  categorySelector,
  searchTextSelector,
  useSearchStore
} from '../../utils/state/searchState'

export function useListSearch(isEnabled: boolean) {
  const router = useRouter()
  let searchParamsCategories = useSearchStore(categorySelector)
  let searchText = useSearchStore(searchTextSelector)

  if (!isEnabled) {
    return {}
  }
  const query = router?.query
  if (!searchParamsCategories.length && query?.search__categories) {
    searchParamsCategories = Array.isArray(query.search__categories)
      ? query.search__categories
      : [query.search__categories]
  }
  if (!searchText && query?.search__text) {
    searchText = query.search__text as string
  }
  return {
    searchText,
    searchParamsCategories
  }
  /*
  if (searchParamsCategories.length || searchText) {
    items = items.filter((item) => {
      const itemCategories = item.tag_list || []
      const inCategory = searchParamsCategories.length
        ? searchParamsCategories.some((element) =>
            itemCategories.includes(element)
          )
        : false
      if (inCategory) {
        return true
      }
      const pageContent = item.content
      const inSearchText = searchText
        ? [item.full_slug, pageContent.preview_title].some(
            // eslint-disable-next-line
            // @ts-ignore
            (term) => term && term.search(new RegExp(searchText, 'i')) !== -1
          )
        : undefined
      if (inSearchText === undefined) {
        return false
      }
      return inSearchText
    })
  }
  return items

   */
}

export const legacyClientListWidgetSearch = (
  items: AllStoryData,
  {
    searchParamsCategories = [],
    searchText
  }: { searchParamsCategories: string[]; searchText?: string }
) => {
  const filteredItems = items.filter((item) => {
    const itemCategories = item.tag_list || []
    const inCategory = searchParamsCategories.length
      ? searchParamsCategories.some((element) =>
          itemCategories.includes(element)
        )
      : false
    if (inCategory) {
      return true
    }
    const pageContent = item.content
    const inSearchText = searchText
      ? [item.full_slug, pageContent.preview_title].some(
          // eslint-disable-next-line
          // @ts-ignore
          (term) => term && term.search(new RegExp(searchText, 'i')) !== -1
        )
      : undefined
    if (inSearchText === undefined) {
      return false
    }
    return inSearchText
  })
  return filteredItems
}
