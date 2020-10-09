import { useRouter } from 'next/router'
import { useGlobalState } from '../../utils/state/state'
import { AppApiRequestPayload } from '../../typings/app'

export function useListSearch(
  items: AppApiRequestPayload['allStories'],
  isEnabled: boolean
) {
  const router = useRouter()
  const [searchParams] = useGlobalState('searchParams')
  if (!isEnabled) {
    return items
  }
  const query = router?.query
  let searchParamsCategories = searchParams.categories || []
  if (!searchParams.categories && query?.search__categories) {
    searchParamsCategories = Array.isArray(query.search__categories)
      ? query.search__categories
      : [query.search__categories]
  }
  let { searchText } = searchParams
  if (!searchParams.searchText && query?.search__text) {
    searchText = query.search__text as string
  }
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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
}
