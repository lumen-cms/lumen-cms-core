import { ImageStoryblok } from '../../typings/generated/components-schema'

export type LmImagePlaceholder = {
  base64: string
  width: number
  height: number
}

export type LmImageProps = {
  content: ImageStoryblok & {
    image_data?: LmImagePlaceholder
  }
  onClick?: () => void
}
