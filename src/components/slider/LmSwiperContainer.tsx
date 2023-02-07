import { PropsWithChildren } from 'react'
import { Swiper, SwiperProps } from 'swiper/react'
import dynamic from 'next/dynamic'
import { SwiperStoryblok } from '../../typings/generated/components-schema'

const EffectCoverflow = dynamic(() => import('./SwiperEffectCoverflow'))
const EffectCube = dynamic(() => import('./SwiperEffectCube'))
const EffectFade = dynamic(() => import('./SwiperEffectFade'))
const EffectFlip = dynamic(() => import('./SwiperEffectFlip'))
const EffectCards = dynamic(() => import('./SwiperEffectCards'))
const EffectCreative = dynamic(() => import('./SwiperEffectCreative'))

export default function LmSwiperContainer({
  children,
  swiperProps,
  effect
}: PropsWithChildren<{
  swiperProps: SwiperProps
  effect: SwiperStoryblok['effect']
}>) {
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
    return <EffectCreative swiperProps={swiperProps}>{children}</EffectCreative>
  }
  return <Swiper {...swiperProps}>{children}</Swiper>
}
