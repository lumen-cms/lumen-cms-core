import useSWR from 'swr'
import { useInView } from 'react-intersection-observer'
import React from 'react'
import GridList from '@material-ui/core/GridList'
import { GridListTile } from '@material-ui/core'
import clsx from 'clsx'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import { useGridListStyles } from '../card/cardListStyles'
import useShadowStyles from '../jss/shadowStyles'
import {
  EdgeProps,
  InstagramMappedProps,
  LmInstagramListProps
} from './instagramTypes'
import { InstagramListItem } from './InstagramListItem'
import { getNumber } from '../../utils/numberParser'
// import fetcher from '../../utils/fetcher'
import { fetchInstagramList } from '../../utils/instagram/instagramHelpers'

// here is the "pk" user ID of an account
// https://www.instagram.com/web/search/topsearch/?query=studentsgoabroad

// https://www.instagram.com/graphql/query?query_id=17888483320059182&variables={%22id%22:3086246170,%22first%22:10,%22after%22:null}

export default function LmInstagramList({ content }: LmInstagramListProps) {
  const username = content.username.trim().replace('@', '')
  const [refIntersectionObserver, inView] = useInView(
    intersectionDefaultOptions
  )
  const classesShadow = useShadowStyles()
  // const { data } = useSWR(
  //   () => (inView ? `/api/instagram/feed/${username}` : null),
  //   fetcher
  // )
  const { data, error } = useSWR(
    () =>
      inView
        ? `${username || process.env.NEXT_PUBLIC_INSTAGRAM_USER_ID}`
        : null,
    fetchInstagramList
  )
  if (error) {
    console.error(error)
  }
  console.log(data)

  const posts: InstagramMappedProps[] = data
    ?.filter((i: { node: EdgeProps }) => {
      if (content.hide_videos) {
        return !i.node.is_video
      }
      if (content.hide_images) {
        return i.node.is_video
      }
      return true
    })
    .map((i: { node: EdgeProps }) => {
      return {
        shortcode: i.node.shortcode,
        image_url: i.node.display_url,
        commented_count: i.node.edge_media_to_comment.count,
        // liked_by: i.node.edge_liked_by.count,
        liked_by: i.node.edge_media_preview_like.count,
        media_preview: i.node.media_preview,
        thumbnail:
          i.node.thumbnail_resources[i.node.thumbnail_resources.length - 1],
        is_video: i.node.is_video,
        description: i.node.edge_media_to_caption.edges[0].node.text,
        alt: i.node.accessibility_caption
      } as InstagramMappedProps
    })
    .splice(0, getNumber(content.max_posts, 12))

  const gridClasses = useGridListStyles({
    columnCount: content.column_count,
    columnCountPhone: content.column_count_phone,
    columnCountTablet: content.column_count_tablet,
    isMasonry: !!content.masonry
  })

  return (
    <div
      ref={refIntersectionObserver}
      style={{
        overflowX: 'hidden'
      }}
      className={clsx({
        [gridClasses.masonry]: content.masonry
      })}
    >
      <GridList
        className={gridClasses.gridList}
        cellHeight={content.height || 'auto'}
        style={{
          columnGap: content.masonry ? `${content.column_gap}px` : undefined
        }}
        spacing={!content.masonry ? Number(content.column_gap || 2) : 0}
      >
        {(posts || []).map((item) => (
          <GridListTile
            key={item.shortcode}
            component="a"
            classes={{
              tile: clsx({
                [classesShadow[
                  content.shadow_effect || ''
                ]]: !!content.shadow_effect
              })
            }}
            href={`https://instagram.com/p/${item.shortcode}`}
            target="_blank"
          >
            <InstagramListItem content={item} options={content} />
          </GridListTile>
        ))}
      </GridList>
    </div>
  )
}
