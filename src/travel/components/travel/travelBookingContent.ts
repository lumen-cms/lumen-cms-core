import type {
  ButtonStoryblok,
  CardStoryblok,
  ColumnStoryblok,
  FlexRowStoryblok,
  HeadlineStoryblok,
  IconStoryblok
} from '../../../typings/generated/components-schema'
import translations from '../../utils/translations'
import type { TravelSectionProps } from './travelSectionContent'
import type { useCurrency } from '../travel-list/helpers'

export function getTravelBookingColumn(
  { content, langKey }: TravelSectionProps,
  currency: ReturnType<typeof useCurrency>
) {
  return {
    _uid: 'col-2',
    component: 'column',
    width_general: '4',
    width_tablet: '8',
    body: [
      {
        _uid: 'card',
        component: 'card',
        content_padding: 4,
        styles: [
          {
            margin: '0 25px',
            elevation: 0,
            border_radius: '12px',
            border_color: { rgba: 'rgba(28,27,27,0.25)' },
            css_properties: [
              {
                component: 'item_key_value',
                key: 'background',
                value:
                  'linear-gradient(126deg, rgba(250,247,246,0) 0%, rgba(255,111,0,0.05) 100%)'
              }
            ]
          }
        ],
        styles_hover: [
          {
            elevation: 4,
            css_properties: [
              {
                component: 'item_key_value',
                key: 'background',
                value:
                  'linear-gradient(126deg, rgba(250,247,246,0) 0%, rgba(255,111,0,0.15) 100%)'
              }
            ]
          }
        ],
        body: [
          {
            component: 'headline',
            _uid: 'el-1',
            typography: 'body2',
            color: 'primary',
            tag: 'h3',
            text: translations[langKey].readyStart,
            class_names: { values: ['mb-0'] }
          } as HeadlineStoryblok,
          {
            component: 'headline',
            _uid: 'el-2',
            typography: 'headline6',
            font: 'alt1',
            class_names: { values: ['pb-2', 'font-weight-800'] },
            text: content.title
          } as HeadlineStoryblok,
          {
            component: 'flex_row',
            _uid: 'el-3',
            align_items: 'center',
            justify: 'flex-start',
            gap: 1,
            body: [
              {
                component: 'icon',
                _uid: 'el-4',
                name: { name: 'check-bold' },
                class_names: { values: ['text-primary'] }
              } as IconStoryblok,
              {
                component: 'headline',
                _uid: 'el-5',
                typography: 'body1',
                text: translations[langKey].flexibleStart
              } as HeadlineStoryblok
            ]
          } as FlexRowStoryblok,
          {
            component: 'flex_row',
            _uid: 'el-4',
            align_items: 'center',
            justify: 'flex-start',
            gap: 1,
            body: [
              {
                component: 'icon',
                _uid: 'el-4',
                name: { name: 'check-bold' },
                class_names: { values: ['text-primary'] }
              } as IconStoryblok,
              {
                component: 'headline',
                _uid: 'el-5',
                typography: 'body1',
                text: content.travel_fast_fact?.duration
              } as HeadlineStoryblok
            ]
          } as FlexRowStoryblok,
          {
            component: 'flex_row',
            _uid: 'el-5',
            align_items: 'center',
            justify: 'flex-start',
            gap: 1,
            body: [
              {
                component: 'icon',
                _uid: 'el-4',
                name: { name: 'check-bold' },
                class_names: { values: ['text-primary'] }
              } as IconStoryblok,
              {
                component: 'headline',
                _uid: 'el-5',
                typography: 'body1',
                text: content.travel_fast_fact?.minimum_age
                  ? (
                      translations[langKey].minimumAge as Record<number, string>
                    )[content.travel_fast_fact?.minimum_age]
                  : ''
              } as HeadlineStoryblok
            ]
          } as FlexRowStoryblok,
          {
            component: 'flex_row',
            _uid: 'el-6',
            align_items: 'center',
            justify: 'flex-start',
            gap: 1,
            body: [
              {
                component: 'icon',
                _uid: 'el-4',
                name: { name: 'check-bold' },
                class_names: { values: ['text-primary'] }
              } as IconStoryblok,
              {
                component: 'headline',
                _uid: 'el-5',
                typography: 'body1',
                text: content.travel_fast_fact?.language_skill
                  ? (
                      translations[langKey].languageSkill as Record<
                        number,
                        string
                      >
                    )[content.travel_fast_fact?.language_skill]
                  : ''
              } as HeadlineStoryblok
            ]
          } as FlexRowStoryblok,
          {
            component: 'flex_row',
            _uid: 'el-7',
            align_items: 'baseline',
            gap: 1,
            class_names: { values: ['py-3'] },
            body: [
              {
                component: 'headline',
                _uid: 'el-4',
                typography: 'body1',
                text: translations[langKey].price_starting
              } as HeadlineStoryblok,
              {
                component: 'headline',
                _uid: 'el-5',
                typography: 'headline3',
                font: 'alt1',
                class_names: { values: ['font-weight-800'] },
                text:
                  content.product?.product_price?.[currency] +
                  ' ' +
                  currency.toUpperCase()
              } as HeadlineStoryblok
            ]
          } as FlexRowStoryblok,
          {
            _uid: 'el-9787',
            component: 'button',
            icon: { name: 'account-check-outline' },
            custom_color: { rgba: 'rgba(255,255,255,1)' },
            font: 'alt1',
            label: translations[langKey].travelDetail.costs,
            properties: ['fullWidth'],
            link: {
              linktype: 'url',
              cached_url: `https://admin.studentsgoabroad.com/signup?tid=${
                content.id
              }&lang=${langKey.toLowerCase()}`
            },
            class_names: { values: ['py-1'] },
            styles: [
              {
                css_properties: [
                  {
                    key: 'background',
                    value:
                      'linear-gradient(to top right, #FF6F00 0%, #FA391B 100%)'
                  }
                ]
              }
            ],
            styles_hover: [
              {
                css_properties: [
                  {
                    key: 'background',
                    value:
                      'linear-gradient(to bottom right, #FF6F00 0%, #FA391B 100%)'
                  }
                ]
              }
            ]
          } as ButtonStoryblok,
          {
            component: 'headline',
            _uid: 'afasfasfsa',
            typography: 'body2',
            class_names: { values: ['mt-3'] },
            text: translations[langKey].questionText
          } as HeadlineStoryblok,
          {
            component: 'button',
            _uid: 'elasdas9',
            icon: { name: 'arrow-right' },
            link: {
              linktype: 'story',
              cached_url: langKey === 'EN' ? '/contact' : '/kontakt'
            },
            label: translations[langKey].questionLink
          } as ButtonStoryblok
        ]
      } as CardStoryblok
    ]
  } as ColumnStoryblok
}
