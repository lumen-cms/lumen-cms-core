// Type bridge for legacy packages whose export maps omit their bundled declarations.
declare module 'swiper' {
  export const A11y: import('swiper/types').SwiperModule
  export const Autoplay: import('swiper/types').SwiperModule
  export const Navigation: import('swiper/types').SwiperModule
  export const Pagination: import('swiper/types').SwiperModule
  export const Scrollbar: import('swiper/types').SwiperModule
  export const EffectCards: import('swiper/types').SwiperModule
  export const EffectCoverflow: import('swiper/types').SwiperModule
  export const EffectCreative: import('swiper/types').SwiperModule
  export const EffectCube: import('swiper/types').SwiperModule
  export const EffectFade: import('swiper/types').SwiperModule
  export const EffectFlip: import('swiper/types').SwiperModule
}
declare module 'swiper/react' {
  export type SwiperProps = import('../vendor/swiper8/react').SwiperProps
  export const Swiper: typeof import('../vendor/swiper8/react')['Swiper']
  export const SwiperSlide: typeof import('../vendor/swiper8/react')['SwiperSlide']
  export const useSwiper: typeof import('../vendor/swiper8/react')['useSwiper']
}
