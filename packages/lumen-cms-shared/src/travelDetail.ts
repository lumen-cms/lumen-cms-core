import type { SectionStoryblok, HeadlineStoryblok, IconStoryblok, RowStoryblok, ImageStoryblok, SwiperItemStoryblok, HtmlStoryblok } from 'lumen-cms-shared/core/typings/generated/components-schema'
import translations from 'lumen-cms-shared/core/travel/utils/translations'
import { mainFlexRowHeadline, type TravelSectionProps } from 'lumen-cms-shared/core/travel/components/travel/travelSectionContent'
import { getTravelDetailsColumn } from 'lumen-cms-shared/core/travel/components/travel/travelDetailsContent'
import { getTravelBookingColumn } from 'lumen-cms-shared/core/travel/components/travel/travelBookingContent'

export function getTravelHeaderContent({ content, langKey }: TravelSectionProps): SectionStoryblok {
  const isGerman = langKey === 'DE'
  const localeTitleString = isGerman ? 'title_de' : 'title'
  const countryName = content.city?.country?.[localeTitleString]
  const cityName = content?.city?.[localeTitleString]
  const travelTypes = content.mn_travel_travel_types
    ?.map((i) => i.travel_type?.[localeTitleString])
    .join(', ')
  const orangeColor = 'rgba(255,154,77,1)'
  return {
        _uid: 'section_parallax_headline',
        component: 'section',
        padding: '17rem 0',
        background: [
          {
            _uid: 'xyz2',
            component: 'background',
            // height: '50vh',
            image:
              content.fileStoryblokByHeaderImageId?.url_new ??
              process.env.PUBLIC_TRAVEL_HEADER_FALLBACK_IMG
          }
        ],
        body: [
          {
            _uid: 'row-1',
            component: 'row',
            styles: [
              {
                margin: '170px 0px -200px 0px'
              }
            ],
            styles_mobile: [
              {
                margin: '100px 0px -200px 0px'
              }
            ],
            body: [
              {
                _uid: 'column-1',
                component: 'column',
                body: [
                  {
                    _uid: 'first-row-headline',
                    component: 'headline',
                    tag: 'h3',
                    typography: 'headline6',
                    custom_color: { rgba: orangeColor },
                    text: `${translations[langKey].ad} | ${travelTypes} in ${countryName}`,
                    class_names: { values: ['mb-0'] }
                  },
                  {
                    _uid: 'headline-1',
                    component: 'headline',
                    tag: 'h1',
                    typography: 'headline4',
                    font: 'alt1',
                    text: content.title,
                    class_names: { values: ['font-weight-800', 'my-0'] },
                    custom_color: { rgba: '#fff' }
                  },
                  {
                    _uid: 'headline-3',
                    component: 'flex_row',
                    align_items: 'center',
                    align_content: 'center',
                    gap: 1,
                    body: [
                      {
                        component: 'icon',
                        name: { name: 'google-maps' },
                        color: { rgba: orangeColor }
                      } as IconStoryblok,
                      {
                        custom_color: { rgba: orangeColor },
                        component: 'headline',
                        typography: 'headline6',
                        text: `${cityName}, ${countryName}`
                      } as HeadlineStoryblok
                    ]
                  }
                ]
              }
            ]
          } as RowStoryblok
        ]
  }
}

export function getTravelGalleryContent({ content }: Pick<TravelSectionProps, 'content'>): SectionStoryblok | null {
  const swiperItems: SwiperItemStoryblok[] = (content.file_storybloks || [])
    .filter((i) => i.url_new)
    .map((item): SwiperItemStoryblok => ({
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
        }
      ]
    }))
  if (!swiperItems.length) return null
  return {
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
            autoslide_duration: '4000',
            property: ['hide_pagination'],
            space_between_slides: '20'
          }
        ]
  }
}

export function getTravelServicesContent({ content, langKey }: TravelSectionProps): SectionStoryblok {
  return {
        _uid: 'service-tabs',
        component: 'section',
        body: [
          mainFlexRowHeadline({
            icon: 'home-circle-outline',
            text: translations[langKey].travelDetail.accommodation
          }),
          {
            _uid: 'asdasfa',
            component: 'html',
            body: content.travel_accommodation?.description,
            styles: [{ margin: '0 0 40px 0' }]
          } as HtmlStoryblok,
          {
            component: 'divider',
            _uid: '123322asdsa'
          },
          mainFlexRowHeadline({
            icon: 'beaker-check-outline',
            text: translations[langKey].travelDetail.service
          }),
          {
            _uid: '12332asdfsa2',
            component: 'html',
            body: content.travel_service?.description
          } as HtmlStoryblok
        ]
  }
}

export function getTravelOverviewContent(props: TravelSectionProps, currency: Parameters<typeof getTravelBookingColumn>[1] = 'eur'): SectionStoryblok {
 return { _uid: 'fast-facts', component: 'section', body: [{ _uid: 'row-1', component: 'row', reverse_on_mobile: true, justify: 'flex-start', align_items: 'flex-start', body: [getTravelDetailsColumn(props), getTravelBookingColumn(props, currency)] }], background: [{ _uid: '2', component: 'background' }] }
}
