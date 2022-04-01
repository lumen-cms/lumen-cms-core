import { LmSwiperItemProps } from './sliderTypes'
import { LmComponentRender } from '@LmComponentRender'
import NextImage from 'next/image'

export default function LmSwiperSlide({ content, options }: LmSwiperItemProps) {
  return (
    <>
      {!!content.image?.filename && (
        <NextImage
          src={content.image.filename}
          alt={content.image.alt || 'swiper'}
          layout={'fill'}
          sizes={options.width ? `${options.width}px` : undefined}
        />
      )}
      {content.body?.map((blok) => (
        <LmComponentRender key={blok._uid} content={blok} />
      ))}
    </>
  )
}
