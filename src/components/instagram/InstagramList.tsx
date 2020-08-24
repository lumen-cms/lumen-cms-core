import useSWR from 'swr'
import { useInView } from 'react-intersection-observer'
import React from 'react'
import GridList from '@material-ui/core/GridList'
import { GridListTile } from '@material-ui/core'
import clsx from 'clsx'
import fetcher from '../../utils/fetcher'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import { InstagramListStoryblok } from '../../typings/generated/components-schema'
import { useGridListStyles } from '../card/cardListStyles'
import { InstagramListItem } from './InstagramListItem'
import useShadowStyles from '../jss/shadowStyles'

const security = process.env.NODE_ENV === 'production' ? 'https' : 'http'

export type LmInstagramListProps = {
  content: InstagramListStoryblok
}

type EdgeProps = {
  shortcode: string
  dimensions: {
    height: number
    width: number
  }
  edge_media_to_caption: {
    edges: {
      node: {
        text: string
      }
    }[]
  }
  display_url: string
  media_preview: string
  edge_liked_by: {
    count: number
  }
  edge_media_to_comment: {
    count: number
  }
  is_video: boolean
  thumbnail_resources: {
    src: string
    config_height: number
    config_width: number
  }[]
  accessibility_caption: string
}
export type InstagramMappedProps = {
  shortcode: string
  image_url: string
  thumbnail: {
    src: string
    config_height: number
    config_width: number
  }
  commented_count: number
  liked_by: number
  media_preview: string
  is_video: boolean
  description: string
  alt: string
}

export function LmInstagramList({ content }: LmInstagramListProps) {
  const username = content.username.trim().replace('@', '')
  const [refIntersectionObserver, inView] = useInView(
    intersectionDefaultOptions
  )
  const classesShadow = useShadowStyles()
  const { data } = useSWR(
    () =>
      inView ? `${security}://www.instagram.com/${username}/?__a=1` : null,
    fetcher
  )
  const posts: InstagramMappedProps[] = data?.graphql?.user?.edge_owner_to_timeline_media?.edges
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
        liked_by: i.node.edge_liked_by.count,
        media_preview: i.node.media_preview,
        thumbnail:
          i.node.thumbnail_resources[i.node.thumbnail_resources.length - 1],
        is_video: i.node.is_video,
        description: i.node.edge_media_to_caption.edges[0].node.text,
        alt: i.node.accessibility_caption,
      } as InstagramMappedProps
    })
    .splice(0, content.max_posts ? Number(content.max_posts) : 12)

  const gridClasses = useGridListStyles({
    columnCount: content.column_count,
    columnCountPhone: content.column_count_phone,
    columnCountTablet: content.column_count_tablet,
    isMasonry: !!content.masonry,
  })

  return (
    <div
      ref={refIntersectionObserver}
      style={{
        overflowX: 'hidden',
      }}
      className={clsx({
        [gridClasses.masonry]: content.masonry,
      })}
    >
      <GridList
        className={gridClasses.gridList}
        cellHeight={content.height || 'auto'}
        style={{
          columnGap: content.masonry ? `${content.column_gap}px` : undefined,
        }}
        spacing={
          !content.masonry
            ? content.column_gap
              ? Number(content.column_gap)
              : 2
            : 0
        }
      >
        {(posts || []).map((item) => (
          <GridListTile
            key={item.shortcode}
            component="a"
            classes={{
              tile: clsx({
                [classesShadow[
                  content.shadow_effect || ''
                ]]: !!content.shadow_effect,
              }),
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
