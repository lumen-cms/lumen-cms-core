// Type bridge for legacy packages whose export maps omit their bundled declarations.
declare module 'swiper' {
  export const A11y: typeof import('../../node_modules/swiper/swiper')['A11y']
  export const Autoplay: typeof import('../../node_modules/swiper/swiper')['Autoplay']
  export const Navigation: typeof import('../../node_modules/swiper/swiper')['Navigation']
  export const Pagination: typeof import('../../node_modules/swiper/swiper')['Pagination']
  export const Scrollbar: typeof import('../../node_modules/swiper/swiper')['Scrollbar']
  export const EffectCards: typeof import('../../node_modules/swiper/swiper')['EffectCards']
  export const EffectCoverflow: typeof import('../../node_modules/swiper/swiper')['EffectCoverflow']
  export const EffectCreative: typeof import('../../node_modules/swiper/swiper')['EffectCreative']
  export const EffectCube: typeof import('../../node_modules/swiper/swiper')['EffectCube']
  export const EffectFade: typeof import('../../node_modules/swiper/swiper')['EffectFade']
  export const EffectFlip: typeof import('../../node_modules/swiper/swiper')['EffectFlip']
}
declare module 'swiper/react' {
  export type SwiperProps =
    import('../../node_modules/swiper/react/swiper-react').SwiperProps
  export const Swiper: typeof import('../../node_modules/swiper/react/swiper-react')['Swiper']
  export const SwiperSlide: typeof import('../../node_modules/swiper/react/swiper-react')['SwiperSlide']
  export const useSwiper: typeof import('../../node_modules/swiper/react/swiper-react')['useSwiper']
}
