import { EffectFade } from 'swiper/modules'
import 'swiper/css/effect-fade'
import { FC, PropsWithChildren } from 'react'
import type { SwiperProps } from 'swiper/react'
import { DeferredSwiper as Swiper } from './DeferredSwiper'

const SwiperEffectFade: FC<
  PropsWithChildren<{
    swiperProps: SwiperProps
  }>
> = ({ children, swiperProps }) => {
  return (
    <Swiper
      {...swiperProps}
      effect={'fade'}
      modules={[...(swiperProps.modules || []), EffectFade]}
    >
      {children}
    </Swiper>
  )
}
export default SwiperEffectFade
