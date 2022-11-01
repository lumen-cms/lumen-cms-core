import { EffectFade } from 'swiper'
import 'swiper/css/effect-fade'
import { FC, PropsWithChildren } from 'react'
import { Swiper, SwiperProps } from 'swiper/react'

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
