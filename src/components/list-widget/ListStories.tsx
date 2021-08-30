import React, { useState } from 'react'
import { LmListStoriesPayload, LmListStoriesProps } from './listWidgetTypes'
import useSWR from 'swr'
import Pagination from '@material-ui/lab/Pagination'
import { getListStoriesParams } from '../../utils/universal/getListStoriesParams'
import { useRouter } from 'next/router'
import { createDeepNestedQueryString } from '../../utils/universal/paramsToQueryString'
import {
  searchTextSelector,
  useSearchStore
} from '../../utils/state/searchState'
import { fetchListStories } from './listUtils/fetchListStories'
import { LmComponentRender } from '@LmComponentRender'
import LmListStoriesContainer from './ListStoriesContainer'
import { CircularProgress } from '@material-ui/core'

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
      : [
          paramString,
          storyData?.data.cv,
          page,
          content.enable_search ? searchText : ''
        ],
    fetchListStories,
    {
      fallbackData: {
        stories: storyData?.data?.stories ?? [],
        cv: storyData?.data.cv,
        total: storyData?.total ?? 0,
        page: 1
      },
      revalidateOnMount: content.enable_search && !storyData?.data?.stories
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
    <div
      id={`list_stories_${content._uid}`}
      style={{
        position: 'relative',
        scrollMarginTop: '100px',
        minHeight: content.enable_min_height ? 'calc(100vh - 120px)' : undefined
      }}
    >
      {isValidating && (
        <div
          style={{
            minHeight: '150px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center'
          }}
        >
          <CircularProgress size={40} />
        </div>
      )}
      {!isValidating && !data?.stories?.length && (
        <div>
          {content.not_found_message?.map((blok) => (
            <LmComponentRender content={blok} key={blok._uid} />
          ))}
        </div>
      )}
      {!isValidating && !!data?.stories?.length && (
        <LmListStoriesContainer
          layout={content.layout}
          _uid={content._uid}
          items={data?.stories || []}
        />
      )}
      {showPagination && (
        <Pagination
          className={'mt-2'}
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
          size={paginate?.size || 'medium'}
          color={paginate?.color || 'standard'}
          shape={paginate?.shape || 'round'}
          variant={paginate?.variant || 'text'}
        />
      )}
    </div>
  )
}
