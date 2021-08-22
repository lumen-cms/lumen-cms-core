import { RefObject, useEffect, useRef, useState } from 'react'
import { LmListStoriesPayload, LmListStoriesProps } from './listWidgetTypes'
import useSWR from 'swr'
import { CONFIG } from '@CONFIG'
import Pagination from '@material-ui/lab/Pagination'
import { getListStoriesParams } from '../../utils/universal/getListStoriesParams'
import { useRouter } from 'next/router'
import { createDeepNestedQueryString } from '../../utils/universal/paramsToQueryString'
import LmNewsListItem from '../news/NewsListItem'

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
    page: Number(storyReq.headers.get('page')),
    ...data
  }
  return resData
}

export default function LmListStories({ content }: LmListStoriesProps) {
  const { locale, defaultLocale } = useRouter()
  const paginate = content.pagination?.[0]
  const [page, setPage] = useState(1)

  const params = getListStoriesParams(content, { locale, defaultLocale })
  const paramString = createDeepNestedQueryString(params)
  const { data, error, isValidating } = useSWR<LmListStoriesPayload>(
    [paramString, content.list_stories_data?.data.cv, page],
    fetcher,
    {
      initialData: {
        stories: content.list_stories_data?.data?.stories ?? [],
        cv: content.list_stories_data.data.cv,
        links: content.list_stories_data.data.links,
        rels: content.list_stories_data.data.rels,
        total: content.list_stories_data?.total ?? 0,
        page: 1
      }
    }
  )
  useEffect(() => {
    if (typeof document !== 'undefined' && !isValidating && page) {
      const destination = document.getElementById(
        'list_stories_' + content._uid
      )
      if (destination) {
        destination.scrollIntoView({
          behavior: 'smooth'
        })
        // initRef.current = 1
      }
    }
  }, [page, isValidating])
  if (error) {
    console.error(error)
  }
  const totalCount = Math.ceil(
    (data?.total ?? content.list_stories_data.total) /
      content.list_stories_data.perPage
  )
  return (
    <div>
      <div
        id={`list_stories_${content._uid}`}
        style={{ scrollMarginTop: '100px' }}
      ></div>
      <div className={'mb-2'}>
        {data?.stories.map((story) => {
          return <LmNewsListItem content={story} key={story.uuid} />
        })}
      </div>
      <Pagination
        disabled={isValidating}
        page={page}
        count={totalCount}
        onChange={(_event, page) => {
          setPage(page)
        }}
        size={paginate?.size}
        color={paginate?.color}
        shape={paginate?.shape}
        variant={paginate?.variant}
      />
    </div>
  )
}
