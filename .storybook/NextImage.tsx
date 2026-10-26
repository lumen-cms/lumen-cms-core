import OriginalImage from 'next/dist/shared/lib/image-external'
import type { ImageProps } from 'next/image'
import isChromatic from 'chromatic/isChromatic'
import { storybookImgLoader } from '../src/utils/storybookImgLoader'

// Keep Next's image rendering and the existing Storybook loader, without
// redefining the immutable exports used by current Next.js versions.
export default function NextImage(props: ImageProps) {
  return (
    <OriginalImage
      {...props}
      {...(typeof props.src === 'string' ? storybookImgLoader(props.src) : {})}
      loading={isChromatic() ? 'eager' : props.loading}
    />
  )
}

export { getImageProps } from 'next/dist/shared/lib/image-external'
