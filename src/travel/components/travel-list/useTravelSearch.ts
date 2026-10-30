import { CategoryStateProp } from '../page/pageContextTypes'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { usePageContext } from '../page/PageContext'
import { AllCategoriesQuery } from '../../typings/generated/hasura-schema'

const fetcher = async ([url, paramsStr, locale]: string[]) => {
  const params: CategoryStateProp = JSON.parse(paramsStr)
  const searchVars = new URLSearchParams()
  Object.keys(params).forEach((key) => {
    // @ts-ignore
    searchVars.append(key, params[key])
  })
  if (locale) {
    searchVars.append('locale', locale)
  }
  const searchStr = searchVars.toString()
  const fetchUrl = searchStr ? `${url}?${searchStr}` : url
  return fetch(fetchUrl).then((r) => r.json())
}

export default function useTravelSearch(isDeactive?: boolean) {
  const { locale } = useRouter()
  const { value } = usePageContext()
  const stringify = JSON.stringify(value)

  const { data, error } = useSWR<AllCategoriesQuery>(
    !isDeactive ? ['/api/categories', stringify, locale] : null,
    fetcher,
    {
      revalidateOnFocus: false
    }
  )

  return {
    error,
    data
  }
}
