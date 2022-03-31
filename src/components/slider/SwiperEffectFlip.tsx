import { EffectFlip } from 'swiper'
import 'swiper/css/effect-flip'
import { FC } from 'react'
import { Swiper, SwiperProps } from 'swiper/react'

const SwiperEffectFlip: FC<{
  swiperProps: SwiperProps
}> = ({ children, swiperProps }) => {
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
