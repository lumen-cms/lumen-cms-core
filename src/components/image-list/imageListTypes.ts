import { Dispatch, SetStateAction } from 'react'
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
  inView: boolean
}

export type ImageListLightboxProps = {
  elements: ImageListItemStoryblok[]
  lightbox: string
  setLightbox: Dispatch<SetStateAction<string>>
  onImageClick: (ImageListItemStoryblok: ImageListItemStoryblok) => void
}
