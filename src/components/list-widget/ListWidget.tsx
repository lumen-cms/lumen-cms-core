import React from 'react'
import { legacyClientListWidgetSearch, useListSearch } from './useListSearch'
import { ListWidgetContainer } from './ListWidgetContainer'
import { LmListWidgetProps } from './listWidgetTypes'
import useSWR from 'swr'
import { CONFIG } from '@CONFIG'
import { useRouter } from 'next/router'
import { getQueryStringOfParams } from '../../utils/universal/getListWidgetParams'
import { StoryData } from 'storyblok-js-client'
import { PageComponent } from '../../typings/generated/schema'
import { LmComponentRender } from '@LmComponentRender'

const fetcher = async (url: string, cv: number) => {
  const storyblokApi = new URL('https://api.storyblok.com/v2/cdn/stories')
  storyblokApi.searchParams.append('cv', `${cv}`)
  storyblokApi.searchParams.append('token', CONFIG.publicToken)
  let input = storyblokApi.toString() + '&' + url
  let storyData = await fetch(input).then((r) => r.json())
  return storyData.stories || []
}

export default function LmListWidget({
  content
}: LmListWidgetProps): JSX.Element {
  // const { listWidgetData } = useAppContext()
  // todo need to rewrite based on useSWR
  const clientSideSearch = useListSearch(!!content.enable_for_search)
  const { locale, defaultLocale } = useRouter()
  const params = getQueryStringOfParams(content, { locale, defaultLocale })
  // console.log(params, clientSideSearch)
  let { data, error } = useSWR<StoryData<PageComponent>[]>(
    process.env.NEXT_PUBLIC_CATEGORIES_LEGACY
      ? null
      : [params, content.list_widget_data?.cv],
    fetcher,
    {
      initialData: content.list_widget_data?.items ?? []
    }
  )
  if (error) {
    console.error(error)
  }
  if (
    content.enable_for_search &&
    process.env.NEXT_PUBLIC_CATEGORIES_LEGACY &&
    (clientSideSearch.searchParamsCategories?.length ||
      clientSideSearch.searchText)
  ) {
    // if its legacy category system search over all data
    data = legacyClientListWidgetSearch(data || [], clientSideSearch)
  }
  // console.log(data, isValidating, error)

  return (
    <div
      style={{
        minHeight: content.enable_for_search ? 'calc(100vh - 120px)' : undefined
      }}
    >
      {!data?.length && (
        <div>
          {content.not_found_content?.map((blok) => (
            <LmComponentRender content={blok} key={blok._uid} />
          ))}
        </div>
      )}
      <ListWidgetContainer
        options={content.list_options}
        content={content}
        items={data || []}
      />
    </div>
  )
}
