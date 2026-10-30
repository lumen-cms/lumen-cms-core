import type {
  FlexRowStoryblok,
  ImageStoryblok,
  SectionStoryblok,
  SwiperItemStoryblok,
  SwiperStoryblok
} from '../../../typings/generated/components-schema'
import { LmComponentRender } from '../../../components/CoreComponents'
import type { TravelSectionProps } from './travelSectionContent'

export function TravelGallery({
  content
}: Pick<TravelSectionProps, 'content'>) {
  const swiperItems = (content.file_storybloks || [])
    .filter((i) => i.url_new)
    .map(
      (item) =>
        ({
          _uid: `image_list_item${item.id}`,
          component: 'swiper_item',
          body: [
            {
              component: 'flex_row',
              _uid: `wrap-${item.url_new}`,
              column: true,
              styles: [
                {
                  component: 'styles',
                  _uid: `style-${item.url_new}`,
                  height: '120px',
                  border_radius: '10px',
                  'object-fit': 'cover'
                }
              ],
              body: [
                {
                  component: 'image',
                  _uid: item.url_new,
                  source: item.url_new,
                  border_radius: '8px'
                } as ImageStoryblok
              ]
            } as FlexRowStoryblok
          ]
        } as SwiperItemStoryblok)
    )
  if (!swiperItems.length) return null
  return (
    <LmComponentRender
      content={
        {
          _uid: 'image-list',
          component: 'section',
          max_width: 'none',
          body: [
            {
              component: 'swiper',
              _uid: 'wiperxxs',
              body: swiperItems,
              theme_color: 'primary.main',
              slides_per_view: '2,3,6',
              autoslide_duration: 4000,
              property: ['hide_pagination'],
              space_between_slides: '20'
            } as SwiperStoryblok
          ]
        } as SectionStoryblok
      }
    />
  )
}
