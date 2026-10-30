import type {
  BackgroundStoryblok,
  ColumnStoryblok,
  FlexRowStoryblok,
  HeadlineStoryblok,
  IconStoryblok,
  RowStoryblok,
  SectionStoryblok
} from '../../../typings/generated/components-schema'
import { LmComponentRender } from '../../../components/CoreComponents'
import translations from '../../utils/translations'
import type { TravelSectionProps } from './travelSectionContent'

export function TravelHeader({ content, langKey }: TravelSectionProps) {
  const isGerman = langKey === 'DE'
  const localeTitleString = isGerman ? 'title_de' : 'title'
  const countryName = content.city?.country?.[localeTitleString]
  const cityName = content?.city?.[localeTitleString]
  const travelTypes = content.mn_travel_travel_types
    ?.map((i) => i.travel_type?.[localeTitleString])
    .join(', ')
  const orangeColor = 'rgba(255,154,77,1)'
  return (
    <LmComponentRender
      content={
        {
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
                process.env.NEXT_PUBLIC_TRAVEL_HEADER_FALLBACK_IMG
            } as BackgroundStoryblok
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
                    } as HeadlineStoryblok,
                    {
                      _uid: 'headline-1',
                      component: 'headline',
                      tag: 'h1',
                      typography: 'headline4',
                      font: 'alt1',
                      text: content.title,
                      class_names: { values: ['font-weight-800', 'my-0'] },
                      custom_color: { rgba: '#fff' }
                    } as HeadlineStoryblok,
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
                    } as FlexRowStoryblok
                  ]
                } as ColumnStoryblok
              ]
            } as RowStoryblok
          ]
        } as SectionStoryblok
      }
    />
  )
}
