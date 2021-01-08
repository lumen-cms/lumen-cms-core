export const addSearchParamsToUrl = ({
  categories,
  searchText
}: {
  categories?: string[]
  searchText?: string
}) => {
  const currentUrl = new URL(window.location.href)
  if (categories) {
    currentUrl.searchParams.delete('search__categories')
    categories.forEach((category: string) => {
      currentUrl.searchParams.append('search__categories', category)
    })
  }
  if (searchText !== undefined) {
    if (!searchText) {
      currentUrl.searchParams.delete('search__text')
    } else {
      currentUrl.searchParams.set('search__text', searchText)
    }
  }
  window.history.pushState({ path: currentUrl.href }, '', currentUrl.href)
  window.scrollTo(0, 0)
}
