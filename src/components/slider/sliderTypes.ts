import {
  SliderStoryblok,
  SwiperItemStoryblok,
  SwiperStoryblok
} from '../../typings/generated/components-schema'

export type LmSliderProps = { content: SliderStoryblok }

export type LmSwiperProps = {
  content: SwiperStoryblok
}

export type LmSwiperItemProps = {
  content: SwiperItemStoryblok
  options: SwiperStoryblok
}
