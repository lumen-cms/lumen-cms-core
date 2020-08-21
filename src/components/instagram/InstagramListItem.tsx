import { LmInstagramPost } from './InstagramPost'
import React from 'react'
import { InstagramMappedProps } from './InstagramList'
import { InstagramListStoryblok } from '../../typings/generated/components-schema'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import Comment from 'mdi-material-ui/Comment'
import Heart from 'mdi-material-ui/Heart'

type InstagramListItemProps = {
  content: InstagramMappedProps,
  options: InstagramListStoryblok
}

export function InstagramListItem({ content, options }: InstagramListItemProps) {
  if (options.type === 'image') {
    const Social = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          {!options.hide_comments && content.commented_count > 0 && (
            <>
              <Comment fontSize={'small'} />
              {content.commented_count}
            </>
          )}
        </div>
        <div>
          {!options.hide_likes && content.liked_by > 0 && (
            <>
              {content.liked_by}
              <Heart fontSize={'small'} />
            </>
          )}
        </div>
      </div>
    )
    return (
      <>
        <img src={content.thumbnail.src}
             alt={content.alt}
             style={{
               width: '100%',
               height: !options.height ? 'auto' : '100%',
               objectFit: options.height ? 'cover' : undefined
             }}
             width={content.thumbnail.config_width}
             height={content.thumbnail.config_height} />
        {(!options.hide_comments || !options.hide_likes) && (
          <GridListTileBar
            subtitle={<Social />}
            titlePosition={'top'} />
        )}
        {!options.hide_description && (
          <GridListTileBar subtitle={content.description.split('#')[0]}
                           titlePosition={'bottom'} />
        )}
      </>
    )
  }
  return (
    <div>
      <LmInstagramPost content={{
        url: `https://instagr.am/p/${content.shortcode}`,
        hide_caption: options?.hide_caption || undefined,
        _uid: content.shortcode,
        component: 'instagram_post'
      }}
      />
    </div>
  )
}
