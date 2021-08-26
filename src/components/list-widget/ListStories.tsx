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
import LmNewsList from './NewsList'
import {
  CardListStoryblok,
  ListsStoryblok,
  NavListStoryblok,
  NewsListStoryblok
} from '../../typings/generated/components-schema'
import { fetchListStories } from './listUtils/fetchListStories'
import ListWidgetLists from './ListWidgetLists'
import { ListWidgetLinks } from './ListWidgetLinks'
import { ListWidgetCards } from './ListWidgetCards'

export default function LmListStories({ content }: LmListStoriesProps) {
  const { locale, defaultLocale } = useRouter()
  const paginate = content.pagination?.[0]
  const [page, setPage] = useState(1)
  const searchText = useSearchStore(searchTextSelector)
  const params = getListStoriesParams(content, { locale, defaultLocale })
  const paramString = createDeepNestedQueryString(params)
  const layout = content.layout?.[0]
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
    <div
      id={`list_stories_${content._uid}`}
      style={{ scrollMarginTop: '100px' }}
    >
      {
        {
          news_list: (
            <LmNewsList
              items={data?.stories || []}
              options={(layout || {}) as NewsListStoryblok}
            />
          ),
          card_list: (
            <ListWidgetCards
              disablePagination={true}
              _uid={content._uid}
              options={(layout || {}) as CardListStoryblok}
              items={data?.stories || []}
            />
          ),
          lists: (
            <ListWidgetLists
              options={(layout || {}) as ListsStoryblok}
              items={data?.stories || []}
            />
          ),
          nav_list: (
            <ListWidgetLinks
              _uid={content._uid}
              options={(layout || {}) as NavListStoryblok}
              items={data?.stories || []}
            />
          )
        }[layout?.component || 'news_list']
      }
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
          size={paginate?.size}
          color={paginate?.color}
          shape={paginate?.shape}
          variant={paginate?.variant}
        />
      )}
    </div>
  )
}
