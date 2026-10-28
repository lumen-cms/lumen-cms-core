import {
  getOriginalImageDimensions,
  getRootImageUrl
} from '../../utils/imageServices'
import { storyblokImageLoader } from '../../utils/storyblokImageLoader'
import Image from 'next/image'
import { CSSProperties } from 'react'

type ImageBaseProps = {
  src: string
  alt?: string
  respectRatio?: boolean
  style?: CSSProperties
}

export function ImageBase({ src, alt, respectRatio, style }: ImageBaseProps) {
  if (!src) {
    return null
  }
  const { width, height } = getOriginalImageDimensions(src)

  if (respectRatio) {
    return (
      <div
        className="react-aspect-ratio-placeholder"
        style={width && height ? { aspectRatio: `${width} / ${height}` } : {}}
      >
        <Image
          alt={alt || `image url ${src}`}
          src={getRootImageUrl(src)}
          width={width}
          height={height}
          style={{
            width: '100%',
            height: 'auto',
            ...style
          }}
          {...storyblokImageLoader(src)}
        />
      </div>
    )
  }
  return (
    <Image
      alt={alt || `image url ${src}`}
      src={getRootImageUrl(src)}
      width={width}
      height={height}
      style={{
        width: '100%',
        height: 'auto',
        ...style
      }}
      {...storyblokImageLoader(src)}
    />
  )
}
