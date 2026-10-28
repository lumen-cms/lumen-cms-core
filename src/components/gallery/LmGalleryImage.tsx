import type { StoryblokFields } from '../../typings/storyblok-extensions'
import Image from 'next/image'
import {
  GalleryStoryblok,
  ImageCoreStoryblok
} from '../../typings/generated/components-schema'
import {
  getOriginalImageDimensions,
  getRootImageUrl,
  imageCalculateWidth
} from '../../utils/imageServices'
import { storyblokImageLoader } from '../../utils/storyblokImageLoader'
import Box from '@mui/material/Box'
import type { AdvancedSx } from '../../utils/hooks/useStylesAdvanced'

type LmGalleryImageProps = {
  content: ImageCoreStoryblok
  options: Omit<StoryblokFields<GalleryStoryblok>, 'content'>
  imageSx: AdvancedSx
}
export default function LmGalleryImage({
  content,
  options,
  imageSx
}: LmGalleryImageProps) {
  const imageSource = content.url

  if (!imageSource) {
    return null
  }

  const originalDimensions = getOriginalImageDimensions(imageSource || '')
  let width = originalDimensions.width
  const height = Number(options.image_height || originalDimensions.height)
  if (options.image_height) {
    width = imageCalculateWidth(height, originalDimensions)
  }
  return (
    <Box
      style={{ height: height + 'px', width: width + 'px', overflow: 'hidden' }}
      sx={[imageSx]}
    >
      <Image
        src={getRootImageUrl(imageSource)}
        {...storyblokImageLoader(imageSource)}
        width={width}
        height={height}
        style={{
          width: '100%',
          height: 'auto'
        }}
        alt={content.alt || 'gallery image'}
      />
    </Box>
  )
}
