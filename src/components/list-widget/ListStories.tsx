import { useRef, useState } from 'react'
import { LmListStoriesPayload, LmListStoriesProps } from './listWidgetTypes'
import useSWR from 'swr'
import { CONFIG } from '@CONFIG'
import Pagination from '@material-ui/lab/Pagination'
import { getListStoriesParams } from '../../utils/universal/getListStoriesParams'
import { useRouter } from 'next/router'
import { createDeepNestedQueryString } from '../../utils/universal/paramsToQueryString'
import LmNewsListItem from './NewsListItem'
import {
  searchTextSelector,
  useSearchStore
} from '../../utils/state/searchState'

const fetcher = async (
  url: string,
  cv: number,
  page: number,
  searchText: string
) => {
  const storyblokApi = new URL('https://api.storyblok.com/v2/cdn/stories')
  storyblokApi.searchParams.append('cv', `${cv}`)
  storyblokApi.searchParams.append('token', CONFIG.publicToken)
  storyblokApi.searchParams.append('page', `${page}`)
  if (searchText) {
    storyblokApi.searchParams.append('search_term', searchText)
  }
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
  const searchText = useSearchStore(searchTextSelector)
  const params = getListStoriesParams(content, { locale, defaultLocale })
  const paramString = createDeepNestedQueryString(params)
  const [storyData] = useState<
    LmListStoriesProps['content']['list_stories_data']
  >(content.list_stories_data)
  const { data, error, isValidating } = useSWR<LmListStoriesPayload>(
    content.max_items
      ? null
      : [paramString, storyData?.data.cv, page, searchText],
    fetcher,
    {
      initialData: {
        stories: storyData?.data?.stories ?? [],
        cv: storyData?.data.cv,
        total: storyData?.total ?? 0,
        page: 1
      }
    }
  )

  if (error) {
    console.error(error)
  }
  const currentTotal = data?.total ?? storyData?.total ?? 0
  const perPage = storyData?.perPage ?? 25
  const totalCount = Math.ceil(currentTotal / perPage)
  const showPagination = content.max_items ? false : currentTotal > perPage
  return (
    <div>
      <div
        id={`list_stories_${content._uid}`}
        style={{ scrollMarginTop: '100px' }}
      ></div>
      <div className={'mb-2'}>
        {data?.stories.map((story) => {
          return (
            <LmNewsListItem
              content={story}
              date_format={content.date_format}
              read_more_label={content.read_more_label?.[0]}
              key={story.uuid}
            />
          )
        })}
      </div>
      {showPagination && (
        <Pagination
          disabled={isValidating}
          page={page}
          count={totalCount}
          onChange={(_event, page) => {
            const destination = document.getElementById(
              'list_stories_' + content._uid
            )
            if (destination) {
              destination.scrollIntoView({
                behavior: 'auto'
              })
            }
            setPage(page)
          }}
          size={paginate?.size}
          color={paginate?.color}
          shape={paginate?.shape}
          variant={paginate?.variant}
        />
      )}
    </div>
  )
}
