import React from 'react'
import { useListSearch } from './useListSearch'
import { ListWidgetContainer } from './ListWidgetContainer'
import { LmListWidgetProps } from './listWidgetTypes'
import useSWR from 'swr'
import { CONFIG } from '@CONFIG'
import { useRouter } from 'next/router'
import { getListWidgetParams } from '../../utils/universal/getListWidgetParams'
import { StoryData } from 'storyblok-js-client'
import { PageComponent } from '../../typings/generated/schema'

const fetcher = async (_url: string, cv: number) => {
  const storyblokApi = new URL('https://api.storyblok.com/v2/cdn/stories')
  storyblokApi.searchParams.append('cv', `${cv}`)
  storyblokApi.searchParams.append('token', CONFIG.publicToken)
  let input = storyblokApi.toString()
  console.log(input)
  let storyData = await fetch(input).then((r) => r.json())
  console.log(storyData)
  return storyData.stories || []
}

export default function LmListWidget({
  content
}: LmListWidgetProps): JSX.Element {
  // const { listWidgetData } = useAppContext()
  // todo need to rewrite based on useSWR
  const items = useListSearch(
    content.list_widget_data?.items || [],
    !!content.enable_for_search
  )
  const { locale, defaultLocale } = useRouter()
  const params = getListWidgetParams(content, { locale, defaultLocale })
  console.log(params)
  const { data, isValidating, error } = useSWR<StoryData<PageComponent>[]>(
    ['/', content.list_widget_data?.cv],
    fetcher,
    {
      initialData: content.list_widget_data?.items ?? []
    }
  )
  console.log(data, isValidating, error)

  return (
    <ListWidgetContainer
      options={content.list_options}
      content={content}
      items={data}
    />
  )
}
