import type { SwiperStoryblok, SliderStoryblok } from 'lumen-cms-shared/core/typings/generated/components-schema'

/** Keep Swiper's layout/effect engine for configurations requiring more than one snap per slide. */
export function canUseNativeCarousel(content: SwiperStoryblok | SliderStoryblok): boolean {
 if ((content.slides_per_view || '1').split(',').some(value => Number(value) !== 1)) return false
 if (content.component === 'slider') return true
 return !content.effect && !content.property?.includes('free_mode') && !content.max_pagination_bullets &&
  !(content.space_between_slides || '0').split(',').some(value => Number(value) !== 0)
}
