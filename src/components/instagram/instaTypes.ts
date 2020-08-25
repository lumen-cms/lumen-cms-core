import {
  InstagramListStoryblok,
  InstagramPostStoryblok
} from '../../typings/generated/components-schema'

export type LmInstagramListProps = {
  content: InstagramListStoryblok
}

export type EdgeProps = {
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
export type InstagramListItemProps = {
  content: InstagramMappedProps
  options: InstagramListStoryblok
}

export type LmInstagramPostProps = {
  content: InstagramPostStoryblok
}
