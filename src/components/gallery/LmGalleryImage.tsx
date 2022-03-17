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
import { ClassNameMap } from '@mui/styles';
import { storyblokImageLoader } from '../../utils/storyblokImageLoader'

type LmGalleryImageProps = {
  content: ImageCoreStoryblok
  options: Omit<GalleryStoryblok, 'content'>
  imageStyles: ClassNameMap<'advanced'>
}
export default function LmGalleryImage({
  content,
  options,
  imageStyles
}: LmGalleryImageProps) {
  const imageSource = content.url

  if (!imageSource) {
    return null
  }

  const originalDimensions = getOriginalImageDimensions(imageSource || '')
  let width = originalDimensions.width
  const height = options.image_height || originalDimensions.height
  if (options.image_height) {
    width = imageCalculateWidth(height, originalDimensions)
  }
  return (
    <div
      style={{ height: height + 'px', width: width + 'px', overflow: 'hidden' }}
      className={imageStyles.advanced}
    >
      <Image
        src={getRootImageUrl(imageSource)}
        {...storyblokImageLoader(imageSource)}
        width={width}
        height={height}
        layout={'intrinsic'}
      />
    </div>
  )
}
