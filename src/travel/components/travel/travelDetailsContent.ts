import type {
  BackgroundStoryblok,
  ColumnStoryblok,
  DividerStoryblok,
  FlexRowStoryblok,
  HeadlineStoryblok,
  HtmlStoryblok,
  IconStoryblok,
  RowStoryblok
} from '../../../typings/generated/components-schema'
import translations from '../../utils/translations'
import { mainFlexRowHeadline } from './travelSectionContent'
import type { TravelSectionProps } from './travelSectionContent'

export function getTravelDetailsColumn({
  content,
  langKey
}: TravelSectionProps) {
  const fastFacts = [
    {
      icon: 'briefcase-clock-outline',
      text: translations[langKey].workingHour_label,
      subtext: (translations[langKey].workingHour as Record<number, string>)[
        content.travel_fast_fact?.working_hour || 0
      ]
    },
    {
      icon: 'account_arrow_right_outline',
      text: translations[langKey].minimumAge_label,
      subtext: content.travel_fast_fact?.minimum_age
        ? (translations[langKey].minimumAge as Record<number, string>)[
            content.travel_fast_fact?.minimum_age
          ]
        : ''
    },
    {
      icon: 'school-outline',
      text: translations[langKey].education_label,
      noTranslate: true,
      subtext: content.travel_fast_fact?.education
    },
    {
      icon: 'account-tie-voice-outline',
      text: translations[langKey].languageSkill_label,
      subtext: content.travel_fast_fact?.language_skill
        ? (translations[langKey].languageSkill as Record<number, string>)[
            content.travel_fast_fact?.language_skill
          ]
        : ''
    }
  ]
  return {
    _uid: 'col-1',
    component: 'column',
    width_general: '8',
    width_tablet: '8',
    body: [
      {
        _uid: 'col-1',
        component: 'flex_row',
        gap: 1,
        body: [
          {
            _uid: 'head-1',
            component: 'headline',
            typography: 'headline5',
            font: 'alt1',
            color: 'primary',
            class_names: { values: ['font-weight-800'] },
            text: translations[langKey].quickFact
          },
          {
            _uid: 'headsasad-1',
            font: 'alt1',
            typography: 'headline5',
            class_names: { values: ['font-weight-800'] },
            component: 'headline',
            text: translations[langKey].adShort
          }
        ] as HeadlineStoryblok[]
      } as FlexRowStoryblok,
      {
        component: 'row',
        _uid: 'row22',
        direction: 'row',
        styles: [{ margin: '0 0 40px 0' }],
        body: fastFacts.map(
          (fact, index) =>
            ({
              _uid: index + '-column',
              component: 'column',
              width_general: 'true',
              width_tablet: 'true',
              width_phone: '2',
              background: [
                {
                  component: 'background',
                  _uid: 'bg',
                  elevation: 1,
                  border_radius: '12px',
                  shadow_effect: 'soft'
                } as BackgroundStoryblok
              ],
              styles_hover: [
                {
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
                  component: 'flex_row',
                  column: true,
                  gap: 1,
                  align_items: 'center',
                  body: [
                    {
                      component: 'icon',
                      _uid: `icon-${index}`,
                      name: { name: fact.icon }
                    } as IconStoryblok,
                    {
                      component: 'headline',
                      _uid: `head-1-${index}`,
                      text: fact.text,
                      font: 'alt1',
                      typography: 'body2',
                      align: 'center',
                      class_names: { values: ['font-weight-800'] }
                    } as HeadlineStoryblok,
                    {
                      component: 'headline',
                      _uid: `head-2-${index}`,
                      text: fact.subtext,
                      typography: 'body2',
                      align: 'center'
                    } as HeadlineStoryblok
                  ]
                } as FlexRowStoryblok
              ]
            } as ColumnStoryblok)
        ) as ColumnStoryblok[]
      } as RowStoryblok,
      {
        component: 'divider',
        _uid: 'dddi1'
      } as DividerStoryblok,
      mainFlexRowHeadline({
        icon: 'map-marker-check-outline',
        text: translations[langKey].travelDetail.overview
      }),
      {
        _uid: '12asdas3',
        component: 'html',
        body: content.overview,
        styles: [{ margin: '0 0 40px 0' }]
      } as HtmlStoryblok,
      {
        component: 'divider',
        _uid: 'dddi1assa'
      } as DividerStoryblok,
      mainFlexRowHeadline({
        icon: 'map-check-outline',
        text: translations[langKey].travelDetail.description
      }),
      {
        _uid: '123adassas',
        component: 'html',
        body: content.description,
        styles: [{ margin: '0 0 40px 0' }]
      } as HtmlStoryblok,
      {
        component: 'divider',
        _uid: 'dddassassi1'
      },
      mainFlexRowHeadline({
        icon: 'clipboard-list-outline',
        text: translations[langKey].travelDetail.program_flow
      }),
      {
        _uid: '1adsas23',
        component: 'html',
        body: content.travel_itinerary?.description
      } as HtmlStoryblok
    ]
  } as ColumnStoryblok
}
