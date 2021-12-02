import React, { useEffect, useRef, useState } from 'react'
import { LmListStoriesPayload, LmListStoriesProps } from './listWidgetTypes'
import useSWR from 'swr'
import { getListStoriesParams } from '../../utils/universal/getListStoriesParams'
import {
  searchTextSelector,
  useSearchStore
} from '../../utils/state/searchState'
import { fetchListStories } from './listUtils/fetchListStories'
import { LmComponentRender } from '@LmComponentRender'
import LmListStoriesContainer from './ListStoriesContainer'
import { CircularProgress } from '@material-ui/core'
import LmListStoriesPagination from './ListStoriesPagination'
import { useAppContext } from '@context/AppContext'
import { useEffectOnce } from 'react-use'
import { Router } from 'next/router'

export default function LmListStories({ content }: LmListStoriesProps) {
  const { locale, defaultLocale, insideStoryblok } = useAppContext()
  const initialize = useRef<boolean>(false)
  const paginate = content.pagination?.[0]
  const [page, setPage] = useState<number>(1)
  const searchText = useSearchStore(searchTextSelector)
  const anchorId = `list_stories_${content._uid}`
  const paramString = JSON.stringify({
    ...getListStoriesParams(content, { locale, defaultLocale }),
    page,
    ...(content.enable_search && searchText
      ? {
          search_term: searchText
        }
      : {})
  })
  const [storyData] = useState<
    LmListStoriesProps['content']['list_stories_data']
  >(content.list_stories_data)
  // let revalidateOnMount = content.enable_search && !storyData?.data?.stories
  const { data, error, isValidating } = useSWR<LmListStoriesPayload>(
    content.max_items
      ? null
      : [paramString, storyData?.data.cv, insideStoryblok],
    fetchListStories,
    {
      fallbackData: {
        stories: storyData?.data?.stories ?? [],
        cv: storyData?.data.cv,
        total: storyData?.total ?? 0,
        page: 1
      },
      revalidateOnFocus: false //,
      // revalidateOnMount: revalidateOnMount
    }
  )
  useEffect(() => {
    const handleRouteChange = () => {
      if (page !== 1) {
        setPage(1)
      }
    }
    if (typeof window !== 'undefined') {
      if (initialize.current) {
        const destination = document.getElementById(anchorId)
        if (destination) {
          setTimeout(() => {
            destination.scrollIntoView({
              behavior: 'smooth'
            })
          }, 1000)
        }
      }
    }
    Router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [page, anchorId, content._uid])
  useEffectOnce(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const p = urlParams.get('page')
      if (p) {
        setPage(Number(p))
      } else if (page !== 1) {
        setPage(1)
      }
    }
  })
  if (error) {
    console.error(error)
  }
  const currentTotal = data?.total ?? storyData?.total ?? 0
  const perPage = storyData?.perPage ?? 25
  const totalCount = Math.ceil(currentTotal / perPage)
  const showPagination = content.max_items ? false : currentTotal > perPage

  const paginationPosition = paginate?.position || 'bottom'

  const onPageChange = (val: number) => {
    setPage(val)
    const url = new URL(window.location.href)
    url.searchParams.set('page', `${val}`)
    window.history.pushState({ path: url.href }, '', url.href)
    initialize.current = true
  }
  return (
    <div
      id={anchorId}
      style={{
        position: 'relative',
        scrollMarginTop: '100px',
        width: '100%',
        minHeight: content.enable_min_height ? 'calc(100vh - 120px)' : undefined
      }}
    >
      {isValidating && (
        <div
          style={{
            minHeight: '350px',
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
      {showPagination && paginationPosition.includes('top') && (
        <LmListStoriesPagination
          page={page}
          options={paginate}
          disabled={isValidating}
          totalCount={totalCount}
          className={'mb-2'}
          onChange={onPageChange}
        />
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
      {showPagination && paginationPosition.includes('bottom') && (
        <LmListStoriesPagination
          page={page}
          options={paginate}
          disabled={isValidating}
          totalCount={totalCount}
          className={'mt-3'}
          onChange={onPageChange}
        />
      )}
    </div>
  )
}
