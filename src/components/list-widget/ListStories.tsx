import { useState } from 'react'
import { LmListStoriesPayload, LmListStoriesProps } from './listWidgetTypes'
import useSWR from 'swr'
import { CONFIG } from '@CONFIG'
import Pagination from '@material-ui/lab/Pagination'
import { getListStoriesParams } from '../../utils/universal/getListStoriesParams'
import { useRouter } from 'next/router'
import { createDeepNestedQueryString } from '../../utils/universal/paramsToQueryString'

const fetcher = async (url: string, cv: number, page: number) => {
  const storyblokApi = new URL('https://api.storyblok.com/v2/cdn/stories')
  storyblokApi.searchParams.append('cv', `${cv}`)
  storyblokApi.searchParams.append('token', CONFIG.publicToken)
  storyblokApi.searchParams.append('page', `${page}`)
  let input = storyblokApi.toString() + '&' + url
  let storyReq = await fetch(input)
  const data = await storyReq.json()
  const resData = {
    total: Number(storyReq.headers.get('total')),
    ...data
  }
  console.log(resData)
  return resData
}

export default function LmListStories({ content }: LmListStoriesProps) {
  const { locale, defaultLocale } = useRouter()
  const paginate = content.pagination?.[0]
  const [page, setPage] = useState(1)
  // const [perPage, setPerPage] = useState(
  //   content.list_stories_data.perPage || 25
  // )
  const params = getListStoriesParams(content, { locale, defaultLocale })
  const paramString = createDeepNestedQueryString(params)
  // console.log(paramString, content.list_stories_data?.data.cv, page)
  const { data, error, isValidating } = useSWR<LmListStoriesPayload>(
    [paramString, content.list_stories_data?.data.cv, page],
    fetcher,
    {
      initialData: {
        stories: content.list_stories_data?.data?.stories ?? [],
        cv: content.list_stories_data.data.cv,
        links: content.list_stories_data.data.links,
        rels: content.list_stories_data.data.rels,
        total: content.list_stories_data?.total ?? 0
      }
    }
  )
  if (error) {
    console.error(error)
  }
  if (isValidating) {
    return <div>loading...</div>
  }
  if (!data) {
    return <div>loading...</div>
  }
  console.log()
  const totalCount = Math.ceil(data.total / content.list_stories_data.perPage)
  return (
    <div id={`list_stories_${content._uid}`}>
      <div>
        {data?.stories.map((story) => {
          return (
            <div key={story.uuid}>
              {story.uuid} {story.content.component}
            </div>
          )
        })}
      </div>
      <Pagination
        count={totalCount}
        onChange={(_event, page) => {
          setPage(page)
          const destination = document.getElementById(
            'list_stories_' + content._uid
          )
          if (destination) {
            destination.scrollIntoView({
              behavior: 'smooth'
            })
          }
        }}
        size={paginate?.size}
        color={paginate?.color}
        shape={paginate?.shape}
        variant={paginate?.variant}
      />
    </div>
  )
}
