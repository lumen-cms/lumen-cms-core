import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react'
import { LmSwiperProps } from './sliderTypes'
import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from 'swiper'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import { LmComponentRender } from '@LmComponentRender'
import dynamic from 'next/dynamic'
import { FC } from 'react'
import { PaginationOptions } from 'swiper/types'

const EffectCoverflow = dynamic(() => import('./SwiperEffectCoverflow'))
const EffectCube = dynamic(() => import('./SwiperEffectCube'))
const EffectFade = dynamic(() => import('./SwiperEffectFade'))
const EffectFlip = dynamic(() => import('./SwiperEffectFlip'))
const EffectCards = dynamic(() => import('./SwiperEffectCards'))
const EffectCreative = dynamic(() => import('./SwiperEffectCreative'))
export default function LmSwiper({ content }: LmSwiperProps) {
  const { property } = content
  const effect = content.effect
  const showPagination = !property?.includes('hide_pagination')
  const swiperProps: SwiperProps = {
    modules: [Scrollbar, A11y, Autoplay, Navigation, Pagination],
    slidesPerView: 1,
    navigation: !content.property?.includes('hide_arrows'),
    ...(showPagination && {
      pagination: {
        clickable: true,
        dynamicBullets: property?.includes('dynamic_bullets')
      } as PaginationOptions
    })
  }
  if (content.autoslide_duration) {
    swiperProps.autoplay = {
      delay: Number(content.autoslide_duration),
      pauseOnMouseEnter: content.pause_on_hover
    }
  }
  const Container: FC = ({ children }) => {
    if (effect === 'coverflow') {
      return (
        <EffectCoverflow swiperProps={swiperProps}>{children}</EffectCoverflow>
      )
    } else if (effect === 'cube') {
      return <EffectCube swiperProps={swiperProps}>{children}</EffectCube>
    } else if (effect === 'fade') {
      return <EffectFade swiperProps={swiperProps}>{children}</EffectFade>
    } else if (effect === 'flip') {
      return <EffectFlip swiperProps={swiperProps}>{children}</EffectFlip>
    } else if (effect === 'cards') {
      return <EffectCards swiperProps={swiperProps}>{children}</EffectCards>
    } else if (effect === 'creative') {
      return (
        <EffectCreative swiperProps={swiperProps}>{children}</EffectCreative>
      )
    }
    return <Swiper {...swiperProps}>{children}</Swiper>
  }
  return (
    <>
      <Container>
        {content.body?.map((blok) => {
          console.log('inside of renderer')
          return (
            <SwiperSlide key={blok._uid}>
              <LmComponentRender
                key={blok._uid}
                content={blok}
                options={content}
              />
            </SwiperSlide>
          )
        })}
      </Container>
    </>
  )
}
