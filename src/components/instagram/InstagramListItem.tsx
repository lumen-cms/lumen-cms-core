import React from 'react'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import Comment from 'mdi-material-ui/Comment'
import Heart from 'mdi-material-ui/Heart'
import LmInstagramPost from './InstagramPost'
import { InstagramListItemProps } from './instagramTypes'

export function InstagramListItem({
  content,
  options
}: InstagramListItemProps) {
  if (options.type === 'image') {
    const Social = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          {!options.hide_comments && content.commented_count > 0 && (
            <>
              <Comment fontSize="small" />
              {content.commented_count}
            </>
          )}
        </div>
        <div>
          {!options.hide_likes && content.liked_by > 0 && (
            <>
              {content.liked_by}
              <Heart fontSize="small" />
            </>
          )}
        </div>
      </div>
    )
    return (
      <>
        <img
          src={content.thumbnail.src}
          alt={content.alt}
          style={{
            width: '100%',
            height: !options.height ? 'auto' : '100%',
            objectFit: options.height ? 'cover' : undefined
          }}
          width={content.thumbnail.config_width}
          height={content.thumbnail.config_height}
        />
        {(!options.hide_comments || !options.hide_likes) && (
          <ImageListItemBar subtitle={<Social />} />
        )}
        {!options.hide_description && (
          <ImageListItemBar
            subtitle={content.description.split('#')[0]}
            position="bottom"
          />
        )}
      </>
    )
  }
  return (
    <div>
      <LmInstagramPost
        content={{
          url: `https://instagr.am/p/${content.shortcode}`,
          hide_caption: options?.hide_caption || undefined,
          _uid: content.shortcode,
          component: 'instagram_post'
        }}
      />
    </div>
  )
}
