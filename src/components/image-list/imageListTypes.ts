import {
  ImageListItemStoryblok,
  ImageListStoryblok
} from '../../typings/generated/components-schema'

export type LmImageListProps = {
  content: ImageListStoryblok
}
export type LmImageListItemProps = {
  content: ImageListItemStoryblok
  listProps: ImageListStoryblok
}
