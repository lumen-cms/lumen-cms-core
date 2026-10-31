import { CategoryStateProp } from '../page/pageContextTypes'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { usePageContext } from '../page/PageContext'
import { AllCategoriesQuery } from '../../typings/generated/hasura-schema'

const fetcher = async ([url, paramsStr, locale]: string[]) => {
  const params = JSON.parse(paramsStr) as CategoryStateProp
  const searchVars = new URLSearchParams()
  ;(Object.keys(params) as (keyof CategoryStateProp)[]).forEach((key) => {
    searchVars.append(key, String(params[key]))
  })
  if (locale) {
    searchVars.append('locale', locale)
  }
  const searchStr = searchVars.toString()
  const fetchUrl = searchStr ? `${url}?${searchStr}` : url
  const response = await fetch(fetchUrl)
  if (!response.ok) {
    throw new Error(`Travel category request failed: ${response.status}`)
  }
  return response.json() as Promise<AllCategoriesQuery>
}

export default function useTravelSearch(isDeactive?: boolean) {
  const { locale } = useRouter()
  const { value } = usePageContext()
  const stringify = JSON.stringify(value)

  const { data, error } = useSWR<AllCategoriesQuery, unknown>(
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
