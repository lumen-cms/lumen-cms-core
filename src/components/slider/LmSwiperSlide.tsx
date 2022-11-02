import { LmSwiperItemProps } from './sliderTypes'
import { LmComponentRender } from '@LmComponentRender'
import NextImage, { ImageProps } from 'next/future/image'
import { getOriginalImageDimensions } from '../../utils/imageServices'
import { ImageDataUriFallback } from '../image/ImageDataUri'

function SwiperImage({ content, options }: LmSwiperItemProps) {
  if (content.image?.filename) {
    const imgProps: ImageProps = {
      alt: content.image.alt || 'swiper',
      src: content.image.filename,
      fill: true
    }
    if (
      ['cube', 'cards', 'coverflow', 'creative'].includes(options?.effect || '')
    ) {
      //
    } else {
      const { width, height } = getOriginalImageDimensions(
        content.image.filename
      )
      imgProps.width = width + 'px'
      imgProps.height = height + 'px'
    }
    return (
      <NextImage
        {...imgProps}
        style={{
          objectFit: options.image_object_fit || 'cover'
        }}
        placeholder={'blur'}
        blurDataURL={ImageDataUriFallback}
        sizes={options.width ? `${options.width}px` : undefined}
      />
    )
  }
  return null
}

export default function LmSwiperSlide({ content, options }: LmSwiperItemProps) {
  return (
    <>
      <SwiperImage content={content} options={options} />
      {content.body?.map((blok) => (
        <LmComponentRender key={blok._uid} content={blok} />
      ))}
    </>
  )
}
