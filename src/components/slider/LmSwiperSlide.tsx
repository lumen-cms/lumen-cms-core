import { LmSwiperItemProps } from './sliderTypes'
import { LmComponentRender } from '@LmComponentRender'
import NextImage, { ImageProps } from 'next/image'
import { getOriginalImageDimensions } from '../../utils/imageServices'

function SwiperImage({ content, options }: LmSwiperItemProps) {
  if (content.image?.filename) {
    const imgProps: ImageProps = {
      src: content.image.filename,
      layout: 'fill'
    }
    if (
      ['cube', 'cards', 'coverflow', 'creative'].includes(options?.effect || '')
    ) {
      //
    } else {
      imgProps.layout = 'responsive'
      const { width, height } = getOriginalImageDimensions(
        content.image.filename
      )
      imgProps.width = width + 'px'
      imgProps.height = height + 'px'
    }
    return (
      <NextImage
        {...imgProps}
        alt={content.image.alt || 'swiper'}
        objectFit={options.image_object_fit || 'cover'}
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