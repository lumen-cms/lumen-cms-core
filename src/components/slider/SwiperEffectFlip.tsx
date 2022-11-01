import { EffectFlip } from 'swiper'
import 'swiper/css/effect-flip'
import { FC, PropsWithChildren } from 'react'
import { Swiper, SwiperProps } from 'swiper/react'

const SwiperEffectFlip: FC<
  PropsWithChildren<{
    swiperProps: SwiperProps
  }>
> = ({ children, swiperProps }) => {
  return (
    <div>
      <Swiper
        {...swiperProps}
        effect={'flip'}
        modules={[...(swiperProps.modules || []), EffectFlip]}
      >
        {children}
      </Swiper>
    </div>
  )
}
export default SwiperEffectFlip
