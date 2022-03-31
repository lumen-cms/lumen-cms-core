import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react'
import { LmSliderProps } from './sliderTypes'
import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from 'swiper'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { LmComponentRender } from '@LmComponentRender'
import dynamic from 'next/dynamic'
import { FC, useMemo, useState } from 'react'

const EffectCoverflow = dynamic(() => import('./SwiperEffectCoverflow'))
const EffectCube = dynamic(() => import('./SwiperEffectCube'))
const EffectFade = dynamic(() => import('./SwiperEffectFade'))
const EffectFlip = dynamic(() => import('./SwiperEffectFlip'))
const EffectCards = dynamic(() => import('./SwiperEffectCards'))
const EffectCreative = dynamic(() => import('./SwiperEffectCreative'))
const SwiperPagination = dynamic(() => import('./LmSwiperPagination'))
export default function LmSwiper({ content }: LmSliderProps) {
  const [active, setActive] = useState<number>(0)
  console.log('swiper', content, active)
  const effect: SwiperProps['effect'] = 'creative'
  const swiperProps: SwiperProps = {
    modules: [Navigation, Pagination, Scrollbar, A11y, Autoplay],
    navigation: true,
    slidesPerView: 1,
    watchSlidesProgress: true,
    autoplay: {
      delay: 2000,
      pauseOnMouseEnter: true
    },
    onSlideChange: (swiper) => setActive(swiper.activeIndex),
    pagination: {
      clickable: true,
      dynamicBullets: true,
      type: 'bullets'
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
    <Container>
      {useMemo(() => {
        return (
          content.body?.map((blok) => {
            console.log('inside of renderer')
            return (
              <SwiperSlide key={blok._uid}>
                <LmComponentRender content={blok} />
              </SwiperSlide>
            )
          }) ?? null
        )
      }, [content.body])}
      <span slot={'container-end'}>
        <SwiperPagination />
      </span>
    </Container>
  )
}
