import React from 'react'
import { LmComponentRender } from '../../../components/CoreComponents'

import { useRouter } from 'next/router'
import translations from '../../utils/translations'
import { travelFilterOnCategories } from './travelFilterOnCategories'
import { categoryTypes } from '../page/pageContextTypes'
import { usePageContext } from '../page/PageContext'
import {
  CardListItemStoryblok,
  CardListStoryblok,
  FlexRowStoryblok,
  HeadlineStoryblok
} from '../../../typings/generated/components-schema'
import { AllTravelsQuery } from '../../typings/generated/hasura-schema'
import { useCurrency } from './helpers'

const categoryTypeSet = new Set(categoryTypes)

export type TravelListWidgetProps = {
  _uid: string
  component: 'travel_list_widget'
  is_search?: boolean
  filter_country?: string
  filter_city?: string
  filter_travel_type?: string
  filter_branch?: string
  max_number?: number
  card_options?: CardListStoryblok[]
}

type TravelListWidgetComponentProps = {
  content: TravelListWidgetProps & {
    travels_list_widget_data: AllTravelsQuery['travel']
  }
}

function TravelListWidget({
  content
}: TravelListWidgetComponentProps): React.JSX.Element {
  const { value } = usePageContext()
  const router = useRouter()
  const locale = router.locale?.toUpperCase()
  let travels: AllTravelsQuery['travel'] =
    content.travels_list_widget_data || []

  const query = router?.query || {}
  const contextStringified = JSON.stringify(value)

  const filterOn = contextStringified !== '{}' ? value : query
  if (Object.keys(filterOn).some((item) => categoryTypeSet.has(item))) {
    travels = travelFilterOnCategories(travels, filterOn)
  }
  const optionsFromContent = content.card_options && content.card_options[0]
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
    border_radius: '12' as any,
    title_typography: 'body1',
    title_class_name: { values: ['font-weight-bold'] },
    description_typography: 'body2',
    background_color: { rgba: 'transparent' },
    description_custom: [
      {
        component: 'headline',
        _uid: 'desc',
        max_lines: 2,
        styles: [{ component: 'styles', _uid: 'some_styles_desc' }],
        class_names: { values: ['text-black-50'] }
      }
    ],
    // description_class_name: {values: ['text-2-rows-max', 'text-black-50', 'pb-0']},
    card_actions_disable_spacing: true
  }
  const urlPathLeading = locale === 'DE' ? '/reisen/' : '/travels/'
  const tableLangKey = locale === 'DE' ? 'title_de' : 'title'
  const currency = useCurrency(locale === 'DE' ? 'de' : 'en')
  return (
    <div
      style={{
        minHeight: content.is_search ? '90vh' : undefined
      }}
    >
      {content.is_search && (
        <LmComponentRender
          content={
            {
              _uid: 'headline-1',
              tag: 'h4',
              typography: 'subtitle1',
              component: 'headline',
              text: `${translations[locale as 'EN' | 'DE'].search_result}: ${
                travels.length
              }`,
              class_names: {
                values: ['pl-3', 'pt-3']
              }
            } as HeadlineStoryblok
          }
        />
      )}
      <div style={{ padding: content.is_search ? '16px' : 0 }}>
        <LmComponentRender
          content={{
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
          }}
        />
      </div>
    </div>
  )
}

export default TravelListWidget
