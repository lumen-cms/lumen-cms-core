import type { CardListItemStoryblok, CardListStoryblok, FlexRowStoryblok, HeadlineStoryblok } from 'lumen-cms-shared/core/typings/generated/components-schema'
import type { AllTravelsQuery } from 'lumen-cms-shared/core/travel/typings/generated/hasura-schema'
import translations from 'lumen-cms-shared/core/travel/utils/translations'
import { publicStoryPath, type RouteConfig } from './server/routes'

export function travelDetailPath(slug: string, locale: string, config: RouteConfig, prefix?: string) {
 return publicStoryPath(`${locale}/${prefix || (locale === 'de' ? 'reisen' : 'travels')}/${slug}`, { ...config, rootDirectory: undefined })
}
export interface TravelListContent {
 _uid: string
 component: 'travels_list_widget'
 is_search?: boolean
 filter_country?: string
 filter_city?: string
 filter_travel_type?: string
 filter_branch?: string
 max_number?: number
 card_options?: CardListStoryblok[]
 travels_list_widget_data?: AllTravelsQuery['travel']
}
export function getTravelListContent(content: TravelListContent, locale: 'EN' | 'DE', currency = 'eur'): CardListStoryblok {
 const travels = content.travels_list_widget_data || []
  const optionsFromContent = content.card_options?.[0] ? { ...content.card_options[0] } : undefined
  delete optionsFromContent?.body
  const cardListOptions: CardListStoryblok = optionsFromContent || {
    _uid: content._uid,
    component: 'card_list',
    shadow_effect: 'flowUp',
    column_count: '3',
    column_count_tablet: '4',
    column_count_phone: '1',
    elevation: '0',
    variant: [],
    border_radius: '12',
    title_typography: 'body1',
    title_class_name: { values: ['font-weight-bold'] },
    description_typography: 'body2',
    background_color: { rgba: 'transparent' },
    description_custom: [
      {
        component: 'headline',
        _uid: 'desc',
        max_lines: '2',
        styles: [{ component: 'styles', _uid: 'some_styles_desc' }],
        class_names: { values: ['text-black-50'] }
      }
    ],
    // description_class_name: {values: ['text-2-rows-max', 'text-black-50', 'pb-0']},
    card_actions_disable_spacing: true
  }

 const urlPathLeading = locale === 'DE' ? '/reisen/' : '/travels/'
 const tableLangKey = locale === 'DE' ? 'title_de' : 'title'
 return {
  ...cardListOptions,
            body: travels.map((travel) => {
              const cityStr = (travel.city && travel.city[tableLangKey]) || ''
              // let countryStr = travel.city && travel.city.country && travel.city.country.title || ''
              const travelTypeStr =
                (Array.isArray(travel.mn_travel_travel_types) &&
                  travel.mn_travel_travel_types[0]?.travel_type[
                    tableLangKey
                  ]) ||
                ''

              return {
                _uid: `${travel.id}`,
                component: 'card_list_item',
                title: `${travelTypeStr} ${cityStr}`,
                image: travel.fileStoryblokByPreviewImageId?.url_new,
                description: travel.title,
                link: {
                  fieldtype: 'multilink',
                  id: '',
                  url: '',
                  cached_url: `${urlPathLeading}${travel.slug}`,
                  linktype: 'story',
                  nextHref: `${urlPathLeading}[slug]`
                },
                card_actions_body: [
                  {
                    _uid: 'asdfa',
                    component: 'flex_row',
                    justify: 'space-between',
                    align_items: 'center',
                    styles: [
                      {
                        _uid: `styles-${travel.id}`,
                        component: 'styles',
                        'padding-left': '8px',
                        'padding-right': '8px'
                      }
                    ],
                    body: [
                      {
                        _uid: `right-${travel.id}`,
                        component: 'headline',
                        typography: 'body2',
                        tag: 'p',
                        class_names: {
                          values: ['font-weight-bold']
                        },
                        text: `${
                          translations[locale as 'EN' | 'DE'].price_starting
                        } ${
                          travel.product?.product_price &&
                          travel.product?.product_price[currency]
                        } ${currency.toUpperCase()}`
                      },
                      {
                        _uid: `left-${travel.id}`,
                        component: 'headline',
                        typography: 'body2',
                        tag: 'p',
                        text: travel.product?.duration_days
                          ? `${travel.product?.duration_days} ${translations.DE.duration_days}`
                          : `${translations[locale as 'EN' | 'DE'].minimum} ${
                              travel.product?.duration
                            } ${
                              translations[locale as 'EN' | 'DE'].duration_weeks
                            }`
                      }
                    ] as HeadlineStoryblok[]
                  }
                ] as FlexRowStoryblok[]
              } as CardListItemStoryblok
            })
 }
}
